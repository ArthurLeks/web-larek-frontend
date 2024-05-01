import './scss/styles.scss';
import LarekApi from './components/hist/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';

import { IOrderForm } from './types';

import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import {
	AppState,
	CatalogChangeEvent,
	ProductItem,
} from './components/hist/WebData'
import { Page } from './components/hist/case/Page';
import { Conditional } from './components/hist/case/Conditional';
import { Basket } from './components/hist/case/Basket';
import { Order } from './components/hist/case/Order';

const api: LarekApi = new LarekApi(API_URL);
import EventEmitter from './components/base/events';
import { BasketItem, CardItem } from './components/hist/case/Commodity';
import { Success } from './components/hist/case/Success';

EventEmitter.onAll(({ eventName, data }: { eventName: string, data: any }) => {
	console.log(eventName, data);
});

const successOrderTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#contacts');

const Webdata: AppState = new AppState({}, EventEmitter);

const page: Page = new Page(document.body, EventEmitter);
const modal: Conditional = new Conditional(
	ensureElement<HTMLElement>('#modal-container'),
	EventEmitter
);

const basket: Basket = new Basket(cloneTemplate(basketTemplate), EventEmitter);
let order: Order | null = null;
type CardItemData = {
    title: string;
    image: string;
    description: string;
    price: string;
    category: string;
};
EventEmitter.on<CatalogChangeEvent>('items:changed', () => {
    const updatedCatalog = Webdata.catalog.map((item: ProductItem) => {
        const productData: CardItemData = {
            title: item.title,
            image: CDN_URL + item.image,
            description: item.description,
            price: item.price?.toString() || '0',
            category: item.category,
        };

        const product: CardItem = new CardItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => EventEmitter.emit('product:select', item),
        });

        return product.render(productData);
    });

    page.catalog = updatedCatalog;
    page.counter = Webdata.getBusket().length;
});

EventEmitter.on('product:select', (item: ProductItem) => {
	Webdata.setPreview(item);
});

EventEmitter.on('preview:changed', (item: ProductItem) => {
	const showItem = (item: ProductItem) => {
		const card = new CardItem(cloneTemplate(cardPreviewTemplate), {
			onClick: () => EventEmitter.emit('product:addCard', item),
		});

		modal.render({
			content: card.render({
				title: item.title,
				image: CDN_URL + item.image,
				description: item.description,
				price: item.price?.toString() ?? '0 синапсов',
				status: {
					status: Webdata.basket.includes(item.id),
				},
			}),
		});
	};

	if (item) {
		api
			.getProduct(item.id)
			.then((result) => {
				item.description = result.description;
				item.category = result.category;
				showItem(item);
			})
			.catch((err) => { console.error(err);
		});
} else {
	modal.close();
}
});

EventEmitter.on('product:addCard', (item: ProductItem) => {
	Webdata.addProductToBasket(item);
modal.close();
});

EventEmitter.on('basket:open', () => {
	const items = Webdata.getBusket().map((item, index) => {
		const product = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => EventEmitter.emit('product:removeBusket', item),
		});
		return product.render({
			index: index + 1,
			title: item.title,
			description: item.description,
			price: item.price?.toString() || '0',
			category: item.category,
		});
	});
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			basket.render({
				items,
				total: Webdata.getTotal(),
			}),
		]),
	});
});

EventEmitter.on('product:removeBusket', (item: ProductItem) => {
	Webdata.removeProductFromBasket(item);
EventEmitter.emit('basket:open');
});
EventEmitter.on(/(^order|^contacts):submit/, () => {
	const { email, address, phone } = Webdata.order;
	if (!email || !address || !phone) {
	  return EventEmitter.emit('order:open');
	}
  
	const items = Webdata.getBusket().map(({ id }) => id);
	const total = Webdata.getTotal();
  
	api.createOrder({ ...Webdata.order, items, total })
	  .then(({ error, total: orderTotal }) => {
		const success = new Success(cloneTemplate(successOrderTemplate), {
		  onClose: () => {
			modal.close();
			Webdata.clearBasket();
		  },
		});
  
		success.title = error ? 'Ошибка оформления заказа' : 'Заказ оформлен';
		success.description = error ? error : `Списано ${orderTotal} синапсов`;
  
		modal.render({ content: success.render({ title: success.title, description: success.description }) });
	  })
	  .catch((err) => console.error(err));
  });

  EventEmitter.on('formErrors:change', (errors) => {
	
	const hasErrors = Object.values(errors).some(Boolean);
  
	
	order.valid = !hasErrors;
	order.errors = hasErrors ? Object.values(errors).filter(Boolean).join('; ') : '';
  });

EventEmitter.on(
	/(^order|^contacts)\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		Webdata.setOrderField(data.field, data.value);
	}
);

EventEmitter.on('order:open', () => {
	
	const step = Webdata.order.address && Webdata.order.payment ? 1 : 0;
  
	
	order = new Order(cloneTemplate(step === 0 ? orderTemplate : contactsTemplate), EventEmitter);
  
	
	const data = step === 0 ? { address: '' } : { phone: '', email: '' };
  
	
	modal.render({
	  content: order.render({ ...data, valid: false, errors: [] }),
	});
  });

EventEmitter.on('order:setPaymentType', (data: { paymentType: string }) => {
	Webdata.setOrderField('payment', data.paymentType);
});

EventEmitter.on('modal:open', () => {
	page.locked = true;
});

EventEmitter.on('modal:close', () => {
	page.locked = false;
});

api
	.getProducts()
	.then(Webdata.setCatalog.bind(Webdata))
	.catch((err) => {
		console.error(err);
	});



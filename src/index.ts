import './scss/styles.scss';
import WebLarekApi from './components/store/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';

import { IOrderForm } from './types';

import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import {
	AppState,
	CatalogChangeEvent,
	ProductItem,
} from './components/store/AppData';
import { Page } from './components/store/ui/Page';
import { Modal } from './components/store/ui/Modal';
import { Basket } from './components/store/ui/Basket';
import { Order } from './components/store/ui/Order';

const api = new WebLarekApi(API_URL);
import EventEmitter from './components/base/events';
import { BasketItem, CatalogItem } from './components/store/ui/ProductUI';
import { Success } from './components/store/ui/Success';

EventEmitter.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

const successOrderTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const appData = new AppState({}, EventEmitter);

const page = new Page(document.body, EventEmitter);
const modal = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	EventEmitter
);

const basket = new Basket(cloneTemplate(basketTemplate), EventEmitter);
let order: Order = null;

EventEmitter.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const product = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => EventEmitter.emit('product:select', item),
		});

		return product.render({
			title: item.title,
			image: CDN_URL + item.image,
			description: item.description,
			price: item.price?.toString() || '0',
			category: item.category,
		});
	});

	page.counter = appData.getBusket().length;
});

EventEmitter.on('product:select', (item: ProductItem) => {
	appData.setPreview(item);
});

EventEmitter.on('preview:changed', (item: ProductItem) => {
	const showItem = (item: ProductItem) => {
		const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
			onClick: () => EventEmitter.emit('product:addCard', item),
		});

		modal.render({
			content: card.render({
				title: item.title,
				image: CDN_URL + item.image,
				description: item.description,
				price: item.price?.toString() ?? '0 синапсов',
				status: {
					status: appData.basket.includes(item.id),
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
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

EventEmitter.on('product:addCard', (item: ProductItem) => {
	appData.addProductToBasket(item);
	modal.close();
});

EventEmitter.on('basket:open', () => {
	const items = appData.getBusket().map((item, index) => {
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
				total: appData.getTotal(),
			}),
		]),
	});
});

EventEmitter.on('product:removeBusket', (item: ProductItem) => {
	appData.removeProductFromBasket(item);
});

EventEmitter.on(/(^order|^contacts):submit/, () => {
	if (!appData.order.email || !appData.order.address || !appData.order.phone)
		return EventEmitter.emit('order:open');
	const items = appData.getBusket();
	api
		.createOrder({
			...appData.order,
			items: items.map((i) => i.id),
			total: appData.getTotal(),
		})
		.then((result) => {
			const success = new Success(cloneTemplate(successOrderTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
				},
			});

			modal.render({
				content: success.render({
					title: !result.error ? 'Заказ оформлен' : 'Ошибка оформления заказа',
					description: !result.error
						? `Списано ${result.total} синапсов`
						: result.error,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

EventEmitter.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !address && !email && !phone && !payment;
	order.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

EventEmitter.on(
	/(^order|^contacts)\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

EventEmitter.on('order:open', () => {
	if (order) order = null;
	const step = !appData.order.address && !appData.order.payment ? 0 : 1;
	order = new Order(
		cloneTemplate(!step ? orderTemplate : contactsTemplate),
		EventEmitter
	);
	const data = !step ? { address: '' } : { phone: '', email: '' };
	modal.render({
		content: order.render({
			...data,
			valid: false,
			errors: [],
		}),
	});
});

EventEmitter.on('order:setPaymentType', (data: { paymentType: string }) => {
	appData.setOrderField('payment', data.paymentType);
});

EventEmitter.on('modal:open', () => {
	page.locked = true;
});

EventEmitter.on('modal:close', () => {
	page.locked = false;
});

api
	.getProducts()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

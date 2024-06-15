import './scss/styles.scss';

import { IFormErrors, IOrder, IOrderResult, IProduct } from './types';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { Page } from './components/view/Page';
import { Modal } from './components/common/Modal';
import { AppData } from './components/model/AppData';
import { Card } from './components/view/Card';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactForm } from './components/view/ContactForm';
import { SuccessForm } from './components/view/SuccessForm';

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter();

const appApi = new LarekApi(CDN_URL, API_URL);

const appModel = new AppData({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const ordersForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactForm(cloneTemplate(contactsTemplate), events);
const successForm = new SuccessForm(cloneTemplate(successTemplate), events);


appApi.getProductsCatalog()
	.then((cards) => appModel.setCatalog(cards))
	.catch((error) => console.log(error));

events.on(`catalog:changed`, () => {
	page.catalog = appModel.getCatalog().map((product) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit(`card:select`, product);
			}
		});
		return card.render(product);
	});
});

events.on(`card:select`, (product: IProduct) => {
	const cardPreview = new Card(
		`card`,
		cloneTemplate(cardPreviewTemplate),
			{
				onClick: () => {
					events.emit(`basket:toggleItem`, product);
					// cardPreview.setButtonText(appModel.isInBasket(product.id));
				}
			}
	);
	// cardPreview.setButtonText(appModel.isInBasket(product.id));
	modal.render({ content: cardPreview.render(product) });
});

events.on(`basket:toggleItem`, (product: IProduct) => {
	// if (!appModel.isInBasket(product.id)) {
	// 	appModel.addItemToBasket(product);
	// } else {
	// 	events.emit(`basket:deleteItem`, product)
	// }
	appModel.addItemToBasket(product);
	page.counter = appModel.getBasket().length;
});

events.on(`basket:open`, () => {
	modal.render({
		content: basket.render({list: basket.list, total: basket.total}),
	});
});


events.on(`basket:deleteItem`, (product: IProduct) => {
	appModel.deleteItemFromBasket(product.id, product.index);
});


events.on(`basket:changed`, () => {
	const items = appModel.getBasket().map((card, index) => {
		const itemInBasket = new Card(
			`card`,
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => {
					events.emit(`basket:deleteItem`, card);
				}
			}
		);
		return itemInBasket.render({
			title: card.title,
			price: card.price,
			index: index + 1,
			id: card.id
		});
	});
	basket.render({ list: items, total: appModel.getTotal() });
	page.counter = appModel.getBasket().length;
});

events.on('order:open', () => {
	modal.render({
		content: ordersForm.render({
			valid: appModel.validateOrderForm(),
			errors: [],
		}),
	});
});

events.on(`orderErrors:change`, (errors: IFormErrors) => {
	ordersForm.valid = Object.keys(errors).length === 0;
	ordersForm.errors = Object.values(errors).join(`, `);
});

events.on(`contactErrors:change`, (errors: IFormErrors) => {
	contactsForm.valid = Object.keys(errors).length === 0;
	contactsForm.errors = Object.values(errors).join(`, `);
});

events.on(
	`order.payment:change`,
	(data: { field: keyof IOrder; value: string }) => {
		appModel.setOrderField(data.field, data.value);
	}
);

events.on(
	`order.address:change`,
	(data: { field: keyof IOrder; value: string }) => {
		appModel.setOrderField(data.field, data.value);
	}
);

events.on(
	`contacts.email:change`,
	(data: { field: keyof IOrder; value: string }) => {
		appModel.setOrderField(data.field, data.value);
	}
);

events.on(
	`contacts.phone:change`,
	(data: { field: keyof IOrder; value: string }) => {
		appModel.setOrderField(data.field, data.value);
	}
);

events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			valid: appModel.validateContactForm(),
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	appApi
		.order({
			...appModel.order,
			total: appModel.getTotal(),
			items: appModel.getBasketIds(),
		})
		.then((res) => {
			events.emit(`order:complete`, res);
			appModel.clearAll();
			page.counter = 0;
			ordersForm.clearForm();
			contactsForm.clearForm();
		})
		.catch((error) => {
			console.log(error);
		});
});

events.on(`order:complete`, (res: IOrderResult) => {
	modal.render({ content: successForm.render({ total: res.total }) });
});

events.on(`modal:open`, () => {
	page.locked = true;
});

events.on(`order:finish`, () => {
	modal.close();
});

events.on(`modal:close`, () => {
	page.locked = false;
});

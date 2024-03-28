import { EventEmitter } from '../base/events';
import Modal from './modal';
import * as types from './types';

const cardTemplateStore = (
	document.getElementById('card-catalog') as HTMLTemplateElement
).content;

const cardTemplateBasket = (
	document.getElementById('card-basket') as HTMLTemplateElement
).content;

export default class Product {
	id: string;
	title: string;
	image: string;
	price: number;
	description: string;
	category: string;

	constructor(product: types.Product, private EventEmitter: EventEmitter) {
		this.id = product.id;
		this.title = product.title;
		this.image = product.image;
		this.price = product.price;
		this.description = product.description;
		this.category = product.category;
	}

	renderProduct(type: types.TypeRender): HTMLElement {
		const cardElement =
			type === 'store'
				? (cardTemplateStore
						.querySelector('.card')
						.cloneNode(true) as HTMLButtonElement)
				: (cardTemplateBasket
						.querySelector('.card')
						.cloneNode(true) as HTMLElement);

		if (type === 'store') {
			cardElement.querySelector('.card__category').textContent = this.category;
			cardElement.querySelector('.card__title').textContent = this.title;
			const image = cardElement.querySelector(
				'.card__image'
			) as HTMLImageElement;
			const imgArr = this.image.split('/');
			const imageUrl = imgArr[imgArr.length - 1];
			image.src = `./products/${imageUrl}`;
			image.alt =
				this.description ??
				`Очень информативный аттрибут alt (не знаю как лучше)`;
			cardElement.querySelector('.card__price').textContent = `${
				this.price ?? 0
			} синапсов`;
			cardElement.addEventListener('click', () => {
				this.openPreview();
			});
		}
		if (type === 'basket') {
			const cardElement = cardTemplateBasket
				.querySelector('.card')
				.cloneNode(true) as HTMLElement;
			cardElement.querySelector('.card__title').textContent = this.title;
			cardElement.querySelector(
				'.card__price'
			).textContent = `${this.price} синапсов`;
		}
		return cardElement;
	}

	openPreview(): void {
		const preview = Modal.open('card-preview');
		preview.querySelector('.card__category').textContent = this.category;
		preview.querySelector('.card__title').textContent = this.title;
		preview.querySelector('.card__text').textContent = this.description;
		preview.querySelector(
			'.card__price'
		).textContent = `${this.price} синапсов`;
		const button = preview.querySelector('.button') as HTMLButtonElement;
		button.addEventListener('click', () => {
			this.EventEmitter.emit('cart::product:onAddProduct', this);
			Modal.close();
		});
	}
}

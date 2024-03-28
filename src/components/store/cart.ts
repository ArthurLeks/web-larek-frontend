import { EventEmitter } from '../base/events';
import Modal from './modal';
import Order from './order';
import Product from './product';

export default class Cart {
	public cart: Product[] = [];

	get totalSumm(): number {
		return this.cart.reduce((a, b) => a + b.price, 0);
	}

	constructor(private EventEmitter: EventEmitter) {
		const openCartButton = document.querySelector(
			'.header__basket'
		) as HTMLButtonElement;
		openCartButton.addEventListener('click', () => {
			this.openCart();
		});

		this.EventEmitter.on('cart::product:onAddProduct', (product: Product) => {
			this.onAddProduct(product);
		});

		this.EventEmitter.on(
			'cart::product:onRemoveProduct',
			(product: Product) => {
				this.onRemoveProduct(product);
			}
		);

		this.EventEmitter.on('cart::product:updateBasketCountProduct', () => {
			document.querySelector('.header__basket-counter').textContent =
				this.cart.length.toString();
		});

		this.EventEmitter.on('cart::product:updateBasketPrice', () => {
			const basketContent = document.querySelector('.basket') as HTMLElement;
			const basketPrice = basketContent.querySelector(
				'.basket__price'
			) as HTMLElement;
			basketPrice.textContent = this.totalSumm.toString() + ' синапсов';
		});
	}

	async onAddProduct(product: Product): Promise<void> {
		this.cart.push(product);
		this.EventEmitter.emit('cart::product:updateBasketCountProduct');
	}

	async onRemoveProduct(product: Product): Promise<void> {
		this.cart = this.cart.filter((p) => p.id !== product.id);
		this.renderProduct();
		this.EventEmitter.emit('cart::product:updateBasketCountProduct');
	}

	async renderProduct(): Promise<void> {
		const basketList = document.querySelector('.basket__list') as HTMLElement;
		basketList.replaceChildren();
		for (const product of this.cart) {
			const element = new Product(product, this.EventEmitter).renderProduct(
				'basket'
			);
			element.querySelector(
				'.basket__item-index'
			).textContent = `${this.cart.length}`;
			const deleteButton = element.querySelector(
				'.basket__item-delete'
			) as HTMLButtonElement;
			deleteButton.addEventListener('click', () => {
				this.EventEmitter.emit('cart::product:onRemoveProduct', product);
			});
			basketList.append(element);
		}
		this.EventEmitter.emit('cart::product:updateBasketPrice');
	}

	openCart(): void {
		const basketModal = Modal.open('basket');
		const createOrderButton = basketModal.querySelector(
			'.basket__button'
		) as HTMLButtonElement;
		// if (this.cart.length < 1)
		// 	createOrderButton.setAttribute('disabled', 'disabled');
		// else createOrderButton.removeAttribute('disabled');
		createOrderButton.addEventListener('click', () => {
			new Order(this, this.EventEmitter).createOrder('address');
		});

		this.renderProduct();
	}
}

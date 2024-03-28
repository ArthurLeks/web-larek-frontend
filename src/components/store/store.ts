import Cart from './cart';
import Api from './api';
import Product from './product';
import { EventEmitter } from '../base/events';

const productsGallery = document.querySelector('.gallery');

export class Store {
	private EventEmitter = new EventEmitter();
	public Cart: Cart = new Cart(this.EventEmitter);

	async renderProducts() {
		const result = await Api.getProducts();
		result.items.forEach((product) => {
			productsGallery.append(
				new Product(product, this.EventEmitter).renderProduct('store')
			);
		});
	}
}

export default new Store();

import { Model } from '../base/Model';
import { IAppState, IFormErrors, IOrder, IProduct } from '../../types';

export class AppState extends Model<IAppState> {
	protected basket: IProduct[] = [];
	protected catalog: IProduct[] = [];
	protected order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: '',
	};
	protected formErrors: IFormErrors = {};

	setBasket(items: IProduct[]) {
		this.basket = items;
		this.emitChanges('basket:changed', { basket: this.basket });
	}
	getBasket() {
		return this.basket;
	}

	getBasketIds() {
		return this.basket.map((card) => card.id);
	}

	deleteItemFromBasket(id: string) {
		this.basket = this.basket.filter((card) => card.id !== id);
		this.emitChanges(`basket:changed`, { cards: this.basket });
	}

	addItemToBasket(item: IProduct) {
		this.basket.push(item);
		this.emitChanges(`basket:changed`, { cards: this.basket });
	}

	clearBasket() {
		this.basket = [];
	}

	getTotal() {
		return this.basket.reduce((acc, el) => acc + el.price, 0)
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}


	setOrderField(field: keyof IOrder, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearOrder() {
		this.order = {
			payment: ``,
			address: ``,
			email: ``,
			phone: ``,
		};
	}





}

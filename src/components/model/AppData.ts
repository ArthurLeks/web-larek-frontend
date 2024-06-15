import { Model } from '../base/Model';
import { IAppState, IFormErrors, IOrder, IProduct } from '../../types';

export class AppData extends Model<IAppState> {
	protected basket: IProduct[] = [];
	protected catalog: IProduct[] = [];
	public order: IOrder = {
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

	isInBasket(id: string): boolean {
		return this.basket.some((card) => card.id === id);
	}

	getBasketIds() {
		return this.basket.map((card) => card.id);
	}

	deleteItemFromBasket(id: string, index: number) {
		this.basket = this.basket.filter((card) => card.id !== id || card.index !== index);
		this.emitChanges(`basket:changed`, { cards: this.basket });
	}

	addItemToBasket(item: IProduct, index?: number) {
		this.basket.push({...item, index: index || this.basket.length + 1});
		this.emitChanges(`basket:changed`, { cards: this.basket });
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges(`basket:changed`, { cards: [] });
	}

	getTotal() {
		return this.basket.reduce((acc, el) => acc + el.price, 0)
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	getCatalog() {
		return this.catalog;
	}

	setOrderField(field: keyof IOrder, value: string) {
		this.order[field] = value;

		if (field === `address` || field === `payment`) {
			this.validateOrderForm();
		} else {
			this.validateContactForm();
		}
	}

	validateOrderForm() {
		const errors: IFormErrors = {};
		if (!this.order.address) {
			errors.address = `Введите адрес доставки`;
		}
		if (!this.order.payment) {
			errors.payment = `Выберите способ оплаты`;
		}
		this.formErrors = errors;
		this.emitChanges(`orderErrors:change`, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactForm() {
		const errors: IFormErrors = {};
		if (!this.order.email) {
			errors.email = `Введите email`;
		}
		if (!this.order.phone) {
			errors.phone = `Введите номер телефона`;
		}
		this.formErrors = errors;
		this.emitChanges(`contactErrors:change`, this.formErrors);
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

	clearAll() {
		this.clearOrder()
		this.clearBasket()
	}
}

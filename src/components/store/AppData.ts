import { Model } from '../base/Model';
import { FormErrors, IOrderForm } from '../../types/index';

interface IProduct {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
	category: string;
}

export type CatalogChangeEvent = {
	catalog: ProductItem[];
};

export class ProductItem extends Model<IProduct> {
	description: string;
	id: string;
	image: string;
	title: string;
	category: string;
	price: number;
	status: boolean;
}

export class AppState extends Model<AppState> {
	basket: string[] = [];
	catalog: ProductItem[] = [];
	loading: boolean;
	order = {
		email: '',
		phone: '',
		payment: null as null | string,
		address: '',
		total: 0,
		items: [] as IProduct['id'][],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	addProductToBasket(item: ProductItem) {
		if (this.basket.includes(item.id)) return;
		this.basket.push(item.id);
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	removeProductFromBasket(item: ProductItem) {
		if (!this.basket.includes(item.id)) return;
		const index = this.basket.findIndex((i) => i === item.id);
		this.basket.splice(index, 1);
		this.emitChanges('basket:open', { catalog: this.catalog });
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	getBusket() {
		return this.catalog.filter((item) => this.basket.includes(item.id));
	}

	setPreview(item: ProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setCatalog(data: { items: IProduct[]; total: number }) {
		const { items } = data;
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	getTotal() {
		return this.basket.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateOrder(field)) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder(field: keyof IOrderForm) {
		const errors: typeof this.formErrors = {};
		if (field !== 'address' && field !== 'payment') {
			if (!this.order.email) errors.email = 'Необходимо указать email';
			if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
		} else if (!this.order.address) errors.address = 'Необходимо указать адрес';
		else if (!this.order.payment) errors.address = 'Необходимо выбрать тип оплаты';
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}

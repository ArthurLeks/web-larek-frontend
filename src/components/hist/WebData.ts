import { Model } from '../base/Model';
import { FormErrors, IOrderForm } from '../../types/index';

interface ICommodity {
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

export class ProductItem extends Model<ICommodity> {
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
		items: [] as ICommodity['id'][],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	addProductToBasket(item: ProductItem) {
		
		if (this.basket.includes(item.id)) {
			console.log('Товар уже находится в корзине');
			return;
		}
	
		
		this.basket.push(item.id);
	
		
		this.emitChanges('items:changed', { catalog: this.catalog });
	
		
		console.log(`Элемент с идентификатором ${item.id} добавлено в корзину`);
		this.updateBasketTotal();
	}
	
	updateBasketTotal() {
		
		let total = 0;
		this.basket.forEach((itemId) => {
			const item = this.catalog.find((product) => product.id === itemId);
			if (item) {
				total += item.price;
			}
		});
	
		console.log(`Обновлен общий объем корзины: $${total}`);
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

	setPreview(item: ProductItem): void {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setCatalog({ items, total }: { items: ICommodity[]; total: number }): void {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog, total });
	}

	getTotal(): number {
		return this.basket.reduce(
			(accumulator, currentValue) => accumulator + this.catalog.find((item) => item.id === currentValue).price,
			0
		);
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		const { order, events } = this;
	
		order[field] = value;
	
		if (this.validateOrder(field)) {
			this.emitOrderReadyEvent();
		}
	}
	
	private emitOrderReadyEvent() {
		this.events.emit('order:ready', this.order);
	}

	validateOrder(field: keyof IOrderForm) {
		const errors: typeof this.formErrors = {};
	
		const { email, phone, address, payment } = this.order;
	
		if (field !== 'address' && field !== 'payment') {
			if (!email) {
				errors.email = 'Необходимо указать email';
			} else if (!/^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(email)) {
				errors.email = 'Некорректный формат email. Пожалуйста, введите допустимый email адрес.';
			}
	
			if (!phone) {
				errors.phone = 'Необходимо указать телефон';
			} else if (!/^[0-9+]+$/.test(phone)) {
				errors.phone = 'Некорректный формат телефона. Пожалуйста, введите только цифры и символ +.';
			}
		} else {
			if (!address) {
				errors.address = 'Необходимо указать адрес';
			} else if (!payment) {
				errors.payment = 'Необходимо выбрать тип оплаты';
			}
		}
	
		this.updateFormErrors(errors);
		return this.isFormValid(errors);
	}
	updateFormErrors(errors: Record<string, string>): void {
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
	}

	isFormValid(errors: typeof this.formErrors) {
		return Object.keys(errors).length === 0;
	}
}




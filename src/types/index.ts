export interface IOrderForm {
    email: string;
    phone: string;
	address: string;
	payment: string;
}

export interface IOrder extends IOrderForm {
    items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string[];
	total: number;
	error?: string;
}

export interface IProduct {
	id: string;
	title: string;
	image: string;
	price: number;
	description: string;
	category: string;
}

export interface Products {
	total: number;
	items: IProduct[];
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: IProduct['id'][];
}

export type TypeRender = 'store' | 'basket'

export interface IWebLakerApi {
	getProducts: () => Promise<Products>;
	getProduct: (id: string) => Promise<IProduct>;
	createOrder: (order: IOrder) => Promise<IOrderResult>;
}

export interface IOrderForm {
    email: string;
    phone: string;
}
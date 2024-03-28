export interface Product {
	id: string;
	title: string;
	image: string;
	price: number;
	description: string;
	category: string;
}

export interface Products {
	total: number;
	items: Product[];
}

export type TypePayment = 'online' | 'card';

export interface Order {
	payment: TypePayment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: Product['id'][];
}

export type CreateOrderAnswer = {
	id?: Product['id'][];
	total?: number;
	error?: string;
};

export type TypeRender = 'store' | 'basket';

import { IEvents } from '../components/base/events';

export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	price: number | null;
	category: string;
	index?: number
}


export interface IOrderFormData {
	address: string;
	payment: string;
}

export interface IContactFormData {
	email: string;
	phone: string;
}

export interface ISuccessFormData {
	total: number;
}

export type IOrder = IContactFormData & IOrderFormData;

export type IFormErrors = Partial<IOrder>;

export interface IOrderResult {
	id: string;
	total: number;
}
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	order: IOrder;
	formErrors: IFormErrors;
	events: IEvents;

}


export type IOrderPost = IOrder & {
	total: number;
	items: string[];
}

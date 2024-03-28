import { Api } from '../base/api';
import * as types from './types';

export interface IWebLakerApi {
	getProducts: () => Promise<types.Products>;
	getProduct: (id: string) => Promise<types.Product>;
	createOrder: (order: types.Order) => Promise<types.CreateOrderAnswer>;
}

class WebLarekApi extends Api implements IWebLakerApi {
	constructor(baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

	async getProducts(): Promise<types.Products> {
		return (await this.get('/product/')) as types.Products;
	}

	async getProduct(id: string): Promise<types.Product> {
		return (await this.get(`/product/${id}`)) as types.Product;
	}

	async createOrder(order: types.Order): Promise<types.CreateOrderAnswer> {
		return (await this.post('/order', order)) as types.CreateOrderAnswer;
	}
}

export default new WebLarekApi(
	'https://larek-api.nomoreparties.co/api/weblarek'
);

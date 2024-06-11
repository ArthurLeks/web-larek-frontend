import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderPost, IOrderResult, IProduct } from '../types';

export class LarekApi extends Api {
	protected _cdn: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this._cdn = cdn;
	}

	getProduct(id: string):Promise<IProduct> {
		return this.get(`/product/${id}`).then((res: IProduct) => (
			{
				...res,
				image: `${this._cdn}${res.image}`,
			}
		));
	}

	getProductsCatalog():Promise<IProduct[]> {
		return this.get(`/product`).then((res: ApiListResponse<IProduct>) =>
		res.items.map(el => ({
			...el,
			image: `${this._cdn}${el.image}`,
		})))
	}

	order(data: IOrderPost): Promise<IOrderResult> {
		return this.post(`/order`, data).then((res: IOrderResult) => res)
	}
}

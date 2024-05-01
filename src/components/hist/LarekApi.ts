import { Api } from '../base/api';
import {
    IWebLakerApi,
    Products,
    IOrderResult,
    ICommodity,
    IOrder,
} from '../../types/index';

export default class WebLarekApi extends Api implements IWebLakerApi {
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    async getProducts(): Promise<Products> {
        try {
            const response = await this.fetchData('/product/');
            return response as Products;
        } catch (error) {
            throw new Error('Не удалось получить продукты');
        }
    }

    async getProduct(id: string): Promise<ICommodity> {
        try {
            const response = await this.fetchData(`/product/${id}`);
            return response as ICommodity;
        } catch (error) {
            throw new Error('Не удалось получить продукт');
        }
    }

    async createOrder(order: IOrder): Promise<IOrderResult> {
        try {
            const response = await this.fetchData('/order', {
                method: 'POST',
                body: JSON.stringify(order),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response as IOrderResult;
        } catch (error) {
            throw new Error('Не удалось создать заказ');
        }
    }

    private async fetchData(endpoint: string, options?: RequestInit): Promise<any> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...this.options,
            ...options
        });
        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }
        return await response.json();
    }
}
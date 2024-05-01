
export type ApiResponse<T> = {
    total: number,
    items: T[]
};

export type ApiPostMethods = 'post' | 'put' | 'delete';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'content-type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T | string> {
        return response.ok ? response.json() : response.json().then(data => data.error ?? response.statusText);
    }

    async get<T>(uri: string): Promise<T | string> {
        const response = await fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'get'
        });
        return this.handleResponse<T>(response);
    }

    async post<T>(uri: string, data: object, method: ApiPostMethods = 'post'): Promise<T | string> {
        const response = await fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        });
        return this.handleResponse<T>(response);
    }
}

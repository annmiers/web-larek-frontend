import { Api, ApiListResponse } from './base/api';
import { IApi, IOrder, IOrderResult, IProduct } from './../types/index';

export interface IAppAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder, total:number) => Promise<IOrderResult>;
}

export class AppAPI implements IAppAPI {
    readonly cdn: string;
    private _baseApi: IApi;

    constructor(cdn: string, baseApi: IApi) {
        this._baseApi = baseApi;
        this.cdn = cdn;
    }

    getProductItem(id: string): Promise<IProduct> {
        return this._baseApi.get<IProduct>(`/product/${id}`)
            .then((item: IProduct) => ({
                ...item,
                image: this.cdn + item.image
            })
        );
    }

    getProductList(): Promise<IProduct[]> {
        return this._baseApi.get<ApiListResponse<IProduct>>('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this._baseApi.post<IOrderResult>('/order', order)
            .then((data: IOrderResult) => ({
                ...data,
                total: order.total
            })
        );
    }

}
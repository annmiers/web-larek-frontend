export type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: ProductCategory;
    price: number | null;
}

export interface IAppState {
    catalog: IProduct[];
    basket: IProduct[];
    order: IOrder | null;
    preview: string | null;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type TOrderFormDelivery = Pick<IOrderForm, 'payment' | 'address'>;

export type TOrderFormContacts = Pick<IOrderForm, 'email' | 'phone'>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}


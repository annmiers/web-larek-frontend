export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
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
    items: IProduct[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type TOrderFormDelivery = Pick<IOrderForm, 'payment' | 'address'>;

export type TOrderFormContacts = Pick<IOrderForm, 'email' | 'phone'>;


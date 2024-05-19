import { FormErrors, IAppState, IOrder, IOrderForm, IProduct, ProductCategory, IOrderResult } from './../types/index';
import { Model } from './base/Model';

export type CatalogChangeEvent = {
    catalog: Product[]
};

export class Product extends Model<IProduct> {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ProductCategory;
    price: number | null;

    isInBasket: boolean = false;
}

export class AppState extends Model<IAppState> {
    catalog: Product[];
    basket: Product[];
    order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0
    };
    preview: string | null;
    formErrors: FormErrors = {};

    clearBasket() {
        this.catalog.forEach((item) => {
            item.isInBasket = false;
            this.emitChanges('basket:change', {item: item.isInBasket})
        })
        this.order.items.splice(0,this.order.items.length);
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new Product(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:open', item);
    }

    addToBasket(item: Product) {
        item.isInBasket = true;
        this.order.items.push(item.id);
        this.emitChanges('basket:change', {item: item.isInBasket})
    }

    deleteFromBasket(item: Product) {
        item.isInBasket = false;
        this.order.items.splice(this.order.items.indexOf(item.id), 1)
        this.emitChanges('basket:change', {item: item.isInBasket})
    }

    getBasketItems(): Product[] {
        return this.catalog
            .filter((item) => item.isInBasket === true);
    }

    getTotal() {
        return this.catalog.filter((item) => item.isInBasket === true).reduce(((sum, item) => sum + item.price), 0);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

}
import { Success } from './components/common/Success';
import { OrderContacts, OrderDelivery } from './components/Order';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { AppState, Product } from './components/AppData';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { AppAPI } from './components/AppAPI';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IApi, IOrderForm } from './types';
import { Api } from './components/base/api';
import {cloneTemplate, ensureElement} from "./utils/utils";

const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppAPI(CDN_URL, baseApi);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderDeliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderDelivery = new OrderDelivery(cloneTemplate(orderDeliveryTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(orderContactsTemplate), events);

// Вывести каталог товаров
events.on('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:open', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
        });
    });
});

// Открыть карточку товара
events.on('card:open', (item: Product) => {
    appData.setPreview(item);
});

//Открыть модельное окно с карточкой товара
events.on('preview:open', (item: Product) => {  
    if (item) {
        api.getProductItem(item.id)
            .then(() => {
                const card = new Card(cloneTemplate(cardPreviewTemplate), {
                    onClick: () => {events.emit('basket:add', item)
                    card.setbuttonState(item);
                    }
                });
                card.setbuttonState(item);
                modal.render({
                    content: card.render({
                        title: item.title,
                        image: item.image,
                        description: item.description,
                        category: item.category,
                        price: item.price
                    })
                });
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
});

//Открыть корзину
events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    });
});

//Добавить в корзину
events.on('basket:add', (item: Product) => {
    appData.addToBasket(item);
})

//Удалить из корзины
events.on('basket:delete', (item: Product) => {
    appData.deleteFromBasket(item);
})

//Изменения корзины
events.on('basket:change', () => {
    page.counter = appData.getBasketItems().length;
    let total = 0;
    let index = 1;
    basket.items = appData.getBasketItems().map(item => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('basket:delete', item);
                total = appData.getTotal();
            }

        });
        total = appData.getTotal();
        card.itemIndex = index++;
        return card.render({
            title: item.title,
            price: item.price,
        });
    });
    basket.total = total;
})

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { payment, address, email, phone } = errors;
    orderDelivery.valid = !payment && !address;
    orderContacts.valid = !email && !phone
    orderDelivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    orderContacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Открыть форму заказа (доставка)
events.on('order-delivery:open', () => {
    modal.render({
        content: orderDelivery.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    });
    appData.order.total = appData.getTotal();
});

// Изменилось одно из полей (доставка)
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Открыть форму заказа (контакты)
events.on('order:submit', () => {
    modal.render({
        content: orderContacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});

// Изменилось одно из полей (контакты)
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.orderProducts(appData.order)
        .then((res) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket();
                }
            });
            modal.render({
                content: success.render({
                    total: appData.order.total
                })
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Блокировка страницы, когда открыто модальное окно
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокировка, когда закрываем
events.on('modal:close', () => {
    page.locked = false;
});

// Получить товары с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });
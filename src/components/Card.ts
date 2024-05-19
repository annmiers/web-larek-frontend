import { IProduct } from './../types/index';
import { IEvents } from './base/events';
import { Component } from "./base/Component";
import { ensureElement } from '../utils/utils';
import { Product } from './AppData';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
    protected events: IEvents;
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _itemIndex?: HTMLElement;

    constructor(protected container: HTMLElement, actions?: ICardActions) {
        super(container);
        

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image');
        this._description = container.querySelector('.card__text');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');
        this._itemIndex = container.querySelector('.basket__item-index');


        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
        
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this._title.textContent =  value;
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string) {
        this._description.textContent =  value;
    }

    set category(value: string) {
        this._category.textContent = value;
        switch (value) {
            case 'софт-скил':
                this._category.classList.add('card__category_soft');
                break;
            case 'хард-скил':
                this._category.classList.add('card__category_hard');
                break;
            case 'другое':
                this._category.classList.add('card__category_other');
                break;
            case 'дополнительное':
                this._category.classList.toggle('card__category_additional');
                break;
            case 'кнопка':
                this._category.classList.toggle('card__category_button');
                break;
            }
        }

    set price(value: string) {
        if (value === null) {
            this._price.textContent = 'Бесценно';
            if (this._button) {
                this._button.disabled = true;
            }
        } else
        this._price.textContent = `${value} синапсов`;
    }

    set itemIndex(value: number) {
        this._itemIndex.textContent = String(value);
    }

    setbuttonState(item: Product) {
        if (item.isInBasket === true) {
            this._button.textContent = 'Уже в корзине';
            this._button.disabled = true;
        } else {
            this._button.textContent = 'В корзину';
            this._button.disabled = false;
        }
    }

}
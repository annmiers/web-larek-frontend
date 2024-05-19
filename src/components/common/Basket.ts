import { EventEmitter } from './../base/events';
import { Component } from './../base/Component';
import { ensureElement, createElement } from '../../utils/utils';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order-delivery:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.disabled = false;
        } else {
            this._button.disabled = true;
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set total(total: number) {
        this._total.textContent = `${String(total)} синапсов`;
    }
}
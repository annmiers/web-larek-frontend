import { ensureAllElements, ensureElement } from '../utils/utils';
import { IOrderForm, TOrderFormContacts, TOrderFormDelivery } from './../types/index';
import { IEvents } from './base/events';
import { Form } from "./common/Form";

export type ButtonActions = {
    onClick: (tab: string) => void
}

export class OrderDelivery extends Form<TOrderFormDelivery> {
    protected _buttons: HTMLButtonElement[];
    protected _buttonActive?: HTMLButtonElement;
    protected _buttonsContainer: HTMLElement;
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.textContent;
                const field = 'payment';
                const value = button.textContent;
                this.onInputChange(field, value)
            });
            
        })
    }

    set payment (value: string) {
        this._buttons.forEach(button => {
            button.classList.toggle('button_alt-active', button.textContent === value);
        });
    }
    
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

export class OrderContacts extends Form<TOrderFormContacts> {

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}
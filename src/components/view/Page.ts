import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _basket: HTMLButtonElement;
	protected _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._basket = ensureElement<HTMLButtonElement>(
			`.header__basket`,
			container
		);
		this._counter = ensureElement<HTMLElement>(
			`.header__basket-counter`,
			container
		);
		this._catalog = ensureElement<HTMLElement>(`.gallery`);
		this._wrapper = ensureElement<HTMLElement>(`.page__wrapper`, container);

		this._basket.addEventListener(`click`, () => {
			this.events.emit(`basket:open`);
		});
	}

	// Установить значение счетчика товаров в корзине
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	// Установить карточки в галерею
	set catalog(cards: HTMLElement[]) {
		this._catalog.replaceChildren(...cards);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, `page__wrapper_locked`, value);
	}
}

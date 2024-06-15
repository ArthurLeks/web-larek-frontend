import {Component} from "../base/Component";
import {createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";

interface IBasketView {
	list: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);


		this._button.addEventListener('click', () => {
			events.emit('order:open');
		});

	}

	set list(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста'
			}));
		}
	console.log(items)
		this.setDisabled(this._button, items.length === 0)
	}

	get list(): HTMLElement[] {
		return [...this._list.childNodes].filter(node => node instanceof HTMLLIElement) as HTMLElement[];
	}


	set total(total: number) {
		this.setText(this._total, total + " синапсов");
	}

	get total(): number {
		return parseInt(this._total.textContent) || 0;
	}
}

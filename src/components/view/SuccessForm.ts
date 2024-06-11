import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ISuccessFormData {
	total: number;
}

export class SuccessForm extends Component<ISuccessFormData> {
	protected _closeButton: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, event: IEvents) {
		super(container);

		this._description = ensureElement<HTMLElement>(
			`.order-success__description`,
			this.container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			`.order-success__close`,
			this.container
		);

		this._closeButton.addEventListener(`click`, () => {
			event.emit(`order:finish`);
		});
	}

	set total(value: number) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}

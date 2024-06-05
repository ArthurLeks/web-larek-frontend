import { Form } from '../common/Form';
import { ISuccessFormData } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';


export class SuccessForm extends Form<ISuccessFormData>{
	protected _description: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, event: IEvents) {
		super(container, event);

		this._description = ensureElement(".order-success__description", this.container);
		this._closeButton = ensureElement<HTMLButtonElement>(".order-success__close", this.container);
		this._closeButton.addEventListener(`click`, () => {
			this.event.emit(`order:close`);
		});
	}

	set total(value: number) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}

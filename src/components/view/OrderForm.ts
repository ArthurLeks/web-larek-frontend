import { Form } from '../common/Form';
import { IOrderFormData } from '../../types';
import { IEvents } from '../base/events';
import { ensureAllElements } from '../../utils/utils';


export class OrderForm extends Form<IOrderFormData> {
	protected _paymentButtons : HTMLButtonElement[];
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, event: IEvents) {
		super(container ,event);
		this._paymentButtons = ensureAllElements(".button_alt", this.container);
		this._address = this.container.elements.namedItem("address") as HTMLInputElement;
	}


	set address (value: string) {
		this._address.value = value;
	}

	set paymentButton (name: string) {
		this._paymentButtons.forEach(button => {
			this.toggleClass(button, 'button_alt-active', button.name === name)
		})
	}


	clearForm() {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});

		super.clearForm();
	}
}

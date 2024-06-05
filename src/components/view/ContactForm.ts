import { Form } from '../common/Form';
import {IContactFormData} from '../../types';
import { IEvents } from '../base/events';

export class ContactForm extends Form<IContactFormData> {
	protected _name: HTMLInputElement;
	protected _email: HTMLInputElement;

	constructor(container: HTMLFormElement, event: IEvents) {
		super(container ,event);

		this._name = this.container.elements.namedItem("name") as HTMLInputElement;
		this._email = this.container.elements.namedItem("email") as HTMLInputElement;
	}

	set name (value: string) {
	 	this._name.value = value;
	}

	set email (value: string) {
	 	this._email.value = value;
	}
}

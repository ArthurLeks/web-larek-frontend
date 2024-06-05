import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IFormState {
	valid: boolean;
	errors: string[];
	address: string;
	payment: string;
	phone: string;
	email: string;
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected event: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.event.emit(`${this.container.name}:submit`);
		});

		this.container.addEventListener(`input`, (e: Event) => {
			const input = e.target as HTMLInputElement;
			const field = input.name as keyof T;
			const value = input.value;
			this.onInputChange(field, value);
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	onInputChange(field: keyof T, value: string) {
		this.event.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	clearForm() {
		this.container.reset();
	}
}

import Api from './api';
import { EventEmitter } from '../base/events';
import Modal from './modal';
import Cart from './cart';

type OrderStep = 'address' | 'contacts' | 'final';
type TypePayment = 'online' | 'card';

interface FormElements extends HTMLFormElement {
	address: HTMLInputElement;
	phone: HTMLInputElement;
	email: HTMLInputElement;
}

export default class Order {
	private address: string = null;
	private email: string = null;
	private phone: string = null;
	private typePayment: TypePayment = null;

	constructor(private UserCart: Cart, private EventEmitter: EventEmitter) {
		this.EventEmitter.on(
			'store::order:setTypePayment',
			(data: { typePayment: TypePayment }) => {
				this.typePayment = data.typePayment;
			}
		);
	}

	createOrder(step: OrderStep): void {
		switch (step) {
			case 'address':
				this.loadModalAddress();
				break;
			case 'contacts':
				this.loadModalContact();
				break;
			case 'final':
				this.handleCreateOrder();
				break;
		}
	}

	private loadModalAddress(): void {
		const orderModal = Modal.open('order');

		const altButtons = orderModal.querySelectorAll(
			'.button_alt'
		) as NodeListOf<HTMLButtonElement>;

		const nextOrderButton = orderModal.querySelector(
			'.order__button'
		) as HTMLButtonElement;

		nextOrderButton.setAttribute('disabled', 'disabled');

		altButtons.forEach((button) => {
			button.addEventListener('click', (event) => {
				event.preventDefault();
				this.EventEmitter.emit('store::order:setTypePayment', {
					typePayment: button.name,
				});
				if (form.address.value.length > 1 && this.typePayment)
					nextOrderButton.removeAttribute('disabled');
			});
		});

		const form = <FormElements>document.forms.namedItem('order');
		form.address.addEventListener(
			'change',
			(event) => {
				event.preventDefault();
				if (form.address.value.length > 1 && this.typePayment)
					nextOrderButton.removeAttribute('disabled');
			},
			false
		);

		nextOrderButton.addEventListener('click', () => {
			this.address = form.address.value;
			this.createOrder('contacts');
		});
	}

	private loadModalContact(): void {
		const orderModal = Modal.open('contacts');

		const nextOrderButton = orderModal.querySelector(
			'.button'
		) as HTMLButtonElement;

		nextOrderButton.setAttribute('disabled', 'disabled');

		const form = <FormElements>document.forms.namedItem('contacts');
		form.phone.addEventListener(
			'change',
			(event) => {
				event.preventDefault();
				if (form.email.value.length > 1 && form.email.value.length)
					nextOrderButton.removeAttribute('disabled');
			},
			false
		);
		form.email.addEventListener(
			'change',
			(event) => {
				event.preventDefault();
				if (form.phone.value.length > 1 && form.email.value.length > 1)
					nextOrderButton.removeAttribute('disabled');
			},
			false
		);

		nextOrderButton.addEventListener('click', () => {
			event.preventDefault();
			this.email = form.email.value;
			this.phone = form.phone.value;
			this.createOrder('final');
		});
	}

	private async handleCreateOrder() {
		const result = await Api.createOrder({
			address: this.address,
			email: this.email,
			phone: this.phone,
			payment: this.typePayment,
			items: this.UserCart.cart.map((cart) => cart.id),
			total: this.UserCart.totalSumm,
		});

		const successModal = Modal.open('success');
		if (result as string)
			successModal.querySelector('.order-success__title').textContent =
				'Ошибка покупки!';
		const description = successModal.querySelector(
			'.order-success__description'
		);
		description.textContent = (result as string)
			? (result as string)
			: `Списано ${this.UserCart.totalSumm} синапсов`;

		const successButton = successModal.querySelector('.button');
		successButton.addEventListener('click', () => {
			Modal.close();
		});
	}
}

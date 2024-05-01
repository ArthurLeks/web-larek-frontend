import { Form } from '../case/Form';
import { IOrderForm } from '../../../types';
import { IEvents } from '../../base/events';

export class Order extends Form<IOrderForm> {
	protected _altButtons: HTMLButtonElement[] = [];
	private _activeButton: HTMLButtonElement | null = null;

	// Конструктор класса, принимающий контейнер и события
	constructor(container: HTMLFormElement, events: IEvents) {
		// Вызываем конструктор родительского класса
		super(container, events);

		// Находим все кнопки с классом 'button_alt' в контейнере и преобразуем их в массив
		this._altButtons = Array.from(container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
		// Для каждой кнопки добавляем обработчик события 'click', который вызывает метод handleAltButtonClick с привязкой контекста
		this._altButtons.forEach((button) => {
			button.addEventListener('click', this.handleAltButtonClick.bind(this, button));
			// Устанавливаем атрибут 'aria-pressed' в значение 'false'
			button.setAttribute('aria-pressed', 'false');
		});
	}

	// Метод обработки клика по альтернативной кнопке
	private handleAltButtonClick(button: HTMLButtonElement) {
		// Проверяем, не равна ли текущая активная кнопка нажатой кнопке
		if (this._activeButton !== button) {
			// Если есть активная кнопка, удаляем у нее класс 'button_alt-active' и устанавливаем 'aria-pressed' в 'false'
			if (this._activeButton) {
				this._activeButton.classList.remove('button_alt-active');
				this._activeButton.setAttribute('aria-pressed', 'false');
			}
			// Добавляем класс 'button_alt-active' к нажатой кнопке, устанавливаем 'aria-pressed' в 'true' и обновляем активную кнопку
			button.classList.add('button_alt-active');
			button.setAttribute('aria-pressed', 'true');
			this._activeButton = button;
			// Устанавливаем тип оплаты в соответствии с именем кнопки
			this.payment = button.name;
		}
	}

	// Устанавливаем значение поля формы по имени поля
	setFieldValue(fieldName: string, value: string) {
		// Находим элемент формы по имени поля и устанавливаем ему значение
		const field = this.container.elements.namedItem(fieldName) as HTMLInputElement | null;
		if (field) {
			field.value = value;
		}
	}

	// Устанавливаем тип оплаты и вызываем соответствующее событие
	set payment(value: string) {
		this.events.emit('order:setPaymentType', { paymentType: value });
	}

	// Получаем текущий тип оплаты
	get payment(): string {
		return this._activeButton ? this._activeButton.name : '';
	}

	// Проверяем валидность формы
	validateForm(): boolean {
		// В данном случае всегда возвращаем true, так как метод не реализован
		return true;
	}

	// Отписываемся от событий при удалении объекта
	unsubscribeEvents() {
		// Удаляем обработчик клика для каждой альтернативной кнопки
		this._altButtons.forEach((button) => {
			button.removeEventListener('click', this.handleAltButtonClick.bind(this, button));
		});
	}
}
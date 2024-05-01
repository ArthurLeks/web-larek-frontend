import { Component } from '../../base/Component';
import { IEvents } from '../../base/events';
import { ensureElement } from '../../../utils/utils';

// Интерфейс для состояния формы
interface IFormState {
  valid: boolean;
  errors: string[];
}

// Класс формы, наследуемый от компонента
export class Form<T> extends Component<IFormState> {
  
  protected readonly formName: string;

  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  // Конструктор класса, принимающий контейнер и события
  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    // Установка имени формы
    this.formName = this.container.name;

    // Добавление слушателей событий на ввод и отправку формы
    this.container.addEventListener('input', this.handleInputChange);
    this.container.addEventListener('submit', this.handleFormSubmit);

    // Получение ссылок на кнопку отправки и элемент для ошибок
    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
  }

  // Обработчик отправки формы
  private handleFormSubmit = (e: Event) => {
    e.preventDefault();
    this.events.emit(`${this.container.name}:submit`);
    console.log('Отправленная форма'); 
  };

  // Обработчик изменения ввода
  private handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const field = target.name as keyof T;
    const value = target.value;
    this.onInputChange(field, value);
    console.log('Инициированное входное событие'); 
  };

  // Метод для обновления состояния при изменении ввода
  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value
    });
  }

  // Установка состояния валидности формы
  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  // Установка текста ошибок
  set errors(value: string) {
    this.setText(this._errors, value);
  }

  // Рендеринг формы с учетом переданного состояния
  render(state: Partial<T> & IFormState) {
    const { valid, errors } = state;
    super.render({ valid, errors });
    return this.container;
  }
}
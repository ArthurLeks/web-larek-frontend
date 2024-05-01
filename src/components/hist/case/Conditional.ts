import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/events";

// Объявление интерфейса IModalData с обязательным полем content типа HTMLElement
interface IModalData {
    content: HTMLElement;
}

// Экспорт класса Modal, который наследуется от Component с обобщённым типом IModalData
export class Conditional extends Component<IModalData> {
    // Защищенные свойства _closeButton и _content, представляющие кнопку закрытия и контент модального окна
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    // Конструктор класса, принимающий контейнер и объект событий events типа IEvents
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация _closeButton и _content с помощью функции ensureElement
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Добавление обработчиков событий на кнопку закрытия, контейнер и контент модального окна
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    // Установка нового контента для модального окна
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    // Метод открытия модального окна
    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    // Метод закрытия модального окна
    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    // Метод рендеринга модального окна с данными из IModalData
    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }

    // Метод уничтожения модального окна и удаления обработчиков событий
    destroy() {
        this._closeButton.removeEventListener('click', this.close.bind(this));
        this.container.removeEventListener('click', this.close.bind(this));
        this._content.removeEventListener('click', (event) => event.stopPropagation());
    }

    // Метод установки контента модального окна
    setContent(content: HTMLElement) {
        this.content = content;
    }

    // Метод обновления контента модального окна
    updateContent(content: HTMLElement) {
        this.content = content;
    }
}
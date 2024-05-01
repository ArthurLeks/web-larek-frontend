import { createElement, ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/events';

// Интерфейс для представления корзины
interface IBasketView {
    items: HTMLElement[]; // Элементы корзины
    total: number; // Общее количество
    selected: string[]; // Выбранные элементы
}

// Класс корзины, наследующий от базового компонента и реализующий интерфейс IBasketView
export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement; // Список элементов корзины
    protected _total: HTMLElement; // Общее количество
    protected _button: HTMLButtonElement; // Кнопка
    protected _items: HTMLElement[] = []; // Массив элементов
    protected _totalValue: number = 0; // Общее количество
    protected _selected: string[] = []; // Выбранные элементы

    // Конструктор класса, принимающий контейнер и события
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов корзины
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price') as HTMLElement;
        this._button = this.container.querySelector('.basket__button') as HTMLButtonElement;

        // Инициализация кнопки
        this._initButton();
    }

    // Приватный метод для инициализации кнопки
    private _initButton(): void {
        if (this._button) {
            // Добавление слушателя события на кнопку
            this._button.addEventListener('click', () => {
                this.events.emit('order:open');
            });
        }
    }

    // Сеттер для элементов корзины
    set items(items: HTMLElement[]) {
        this._items = items;
        const isEmpty = items.length === 0;

        // Замена дочерних элементов списка
        this._list.replaceChildren(
            ...(isEmpty
                ? [createElement<HTMLParagraphElement>('p', {
                    textContent: 'Корзина пуста',
                })]
                : items)
        );

        // Установка состояния кнопки в зависимости от наличия элементов
        this._button.disabled = isEmpty;
    }

    // Сеттер для общего количества
    set total(total: number) {
        this._totalValue = total;
        this._setText(this._total, `${total} синапсов`);
    }

    // Сеттер для выбранных элементов
    set selected(selected: string[]) {
        this._selected = selected;
    }

    // Приватный метод для установки текста элемента
    private _setText(element: HTMLElement, text: string): void {
        if (element) {
            element.textContent = text;
        }
    }
}
import { Component } from "../../base/Component";
import { IEvents } from "../../base/events";
import { ensureElement } from "../../../utils/utils";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    private _counter: HTMLElement;
    private _catalog: HTMLElement;
    private _wrapper: HTMLElement;
    private _basket: HTMLElement;

    constructor(container: HTMLElement, protected readonly events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', this.handleBasketClick.bind(this));
    }

    private handleBasketClick(): void {
        this.events.emit('basket:open');
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this._wrapper.classList.toggle('page__wrapper_locked', value);
    }

    // Добавляем новый метод для обновления содержимого корзины
    updateBasketContent(content: string): void {
        // Например, здесь можно обновить содержимое корзины с переданным текстом
        this._basket.textContent = content;
    }

    // Добавляем новый метод для очистки каталога
    clearCatalog(): void {
        this._catalog.innerHTML = ''; // Очищаем весь HTML внутри каталога
    }
}
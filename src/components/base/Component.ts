// Абстрактный класс, представляющий компонент.
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}

    // Переключает CSS класс на элементе.
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        element.classList.toggle(className, force);
    }

    // Устанавливает текстовое содержимое элемента.
    protected setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = value === undefined || value === null ? '' : String(value);
        }
    }

    // Устанавливает состояние disabled для кнопки или input элемента.
    setDisabled(element: HTMLElement, state: boolean): void {
        if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
            element.disabled = state;
        }
    }

    // Добавляет класс 'hidden' к элементу для скрытия.
    protected setHidden(element: HTMLElement): void {
        element.classList.add('hidden');
    }
    // Удаляет класс 'hidden' с элемента для отображения.
    protected setVisible(element: HTMLElement): void {
        element.classList.remove('hidden');
    }

    // Устанавливает src и alt атрибуты для элемента изображения.
    protected setImage(element: HTMLImageElement, src: string, alt: string = ''): void {
        element.src = src;
        element.alt = alt;
    }

    // Отображает компонент с опциональными данными.
    render(data?: Partial<T>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }
}

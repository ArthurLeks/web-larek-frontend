import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface ISuccess {
    title: string;
    description: string;
}

interface ISuccessActions {
    onClose?: () => void;
}

export class Success extends Component<ISuccess> {
    private closeBtn: HTMLElement;
    private titleElement: HTMLElement;
    private descriptionElement: HTMLElement;

    constructor(container: HTMLElement, private actions: ISuccessActions) {
        super(container);

        this.closeBtn = ensureElement<HTMLElement>('.order-success__close', this.container);
        this.titleElement = ensureElement<HTMLElement>('.order-success__title', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);

        this.initializeListeners();
    }

    private initializeListeners(): void {
        if (this.actions.onClose) {
            this.closeBtn.addEventListener('click', this.actions.onClose);
        }
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set descriptionColor(color: string) {
        this.descriptionElement.style.color = color;
    }

    toggleVisibility(): void {
        this.container.classList.toggle('hidden');
    }

    set titleFontSize(size: string) {
        this.titleElement.style.fontSize = size;
    }

    setSuccessType(type: 'info' | 'warning' | 'success' | 'error'): void {
        this.container.className = `success-${type}`;
    }
}
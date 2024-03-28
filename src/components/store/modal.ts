export default class Modal {
	static currentModal: string = null;

	static open(id: string): HTMLElement {
		const modalContainer = document.querySelector(
			'#modal-container'
		) as HTMLElement;
		const modalContent = modalContainer.querySelector(
			'.modal__content'
		) as HTMLElement;
		if (this.currentModal) this.close();
		const closeButton = modalContainer.querySelector(
			'.modal__close'
		) as HTMLButtonElement;
		closeButton.addEventListener('click', () => {
			this.close();
		});
		const modalTemplate = (document.getElementById(id) as HTMLTemplateElement)
			.content;
		const modal = modalTemplate.children[0].cloneNode(true) as HTMLElement;
		modalContent.append(modal);
		modalContainer.style.display = 'block';
		this.currentModal = id;
		return modal;
	}

	static close(): void {
		const modalContainer = document.querySelector(
			'#modal-container'
		) as HTMLElement;
		const modalContent = modalContainer.querySelector(
			'.modal__content'
		) as HTMLElement;
		if (modalContent.children.length > 0) modalContent.replaceChildren();
		modalContainer.style.display = 'none';
		this.currentModal = null;
	}
}

export class MetadataCreatedTabContent {

	private _tabElement: HTMLElement;
	private _contentElement: HTMLElement | null;

	constructor(tabElement: HTMLElement, contentElement: HTMLElement | null) {
		this._tabElement = tabElement;
		this._contentElement = contentElement;
	}

	get tabElement(): HTMLElement {
		return this._tabElement;
	}

	set tabElement(tabElement: HTMLElement) {
		this._tabElement = tabElement;
	}

	get contentElement(): HTMLElement | null {
		return this._contentElement;
	}

	set contentElement(contentElement: HTMLElement | null) {
		this._contentElement = contentElement;
	}
}

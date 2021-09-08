import { MetadataCreatedTabContent } from "./metadata-created-tab-content.model";

export class MetadataCreatedTab {
	private _tabName: string;
	private _tabContent: MetadataCreatedTabContent | null;

	constructor(tabName: string, tabContent: MetadataCreatedTabContent) {
		this._tabName = tabName;
		this._tabContent = tabContent;
	}

	get tabName(): string {
		return this._tabName;
	}

	set tabName(tabName: string) {
		this._tabName = tabName;
	}

	get tabContent(): MetadataCreatedTabContent | null {
		return this._tabContent;
	}

	set tabContent(tabContent: MetadataCreatedTabContent | null) {
		this._tabContent = tabContent;
	}
}

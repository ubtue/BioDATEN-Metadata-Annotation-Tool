export class MetadataPostRequest {
	private _url: string;
	private _body: any;

	constructor(url: string, body: any) {
		this._url = url;
		this._body = body;
	}

	get url(): string {
		return this._url;
	}

	set url(url: string) {
		this._url = url;
	}

	get body(): any {
		return this._body;
	}

	set body(body: any) {
		this._body = body;
	}
}

export class MetadataUserResource {
	position: number;
	id: string;
	title: string;
	lastChange: string;
	status: string;
	statusKey: string;

	constructor(position: number, id: string, title: string, lastChange: string, status: string, statusKey: string) {
		this.position = position;
		this.id = id;
		this.title = title;
		this.lastChange = lastChange;
		this.status = status;
		this.statusKey = statusKey;
	}
}

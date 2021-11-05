export class AlertButton {
	text: string;
	function: Function;

	constructor(text: string, func: Function) {
		this.text = text;
		this.function = func;
	}
}

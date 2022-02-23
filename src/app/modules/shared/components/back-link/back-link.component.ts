import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-back-link',
	templateUrl: './back-link.component.html',
	styleUrls: ['./back-link.component.scss']
})
export class BackLinkComponent implements OnInit {

	readonly POSITIONS = {
		top: 'top',
		bottom: 'bottom'
	};

	@Input() position: String = this.POSITIONS.top;

	/**
	 * constructor
	 */
	constructor() { }


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {
	}

}

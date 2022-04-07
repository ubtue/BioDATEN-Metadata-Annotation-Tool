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

	@Input() level: number = 1;

	route: string = './..';

	/**
	 * constructor
	 */
	constructor() { }


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {

		// If level is > 1 change the route
		if ( this.level > 1 ) {

			this.route = './';

			// Add as many levels as required
			for ( let i = 0; i < this.level; i++ ) {
				this.route += '../';
			}
		}

	}

}

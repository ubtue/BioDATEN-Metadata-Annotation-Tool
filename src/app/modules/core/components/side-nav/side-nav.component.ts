import { UpdateNavigationService } from 'src/app/modules/core/services/update-navigation.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-side-nav',
	templateUrl: './side-nav.component.html',
	styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

	/**
	 * constructor
	 */
	constructor(private updateNavigationService: UpdateNavigationService) { }


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {
	}


	/**
	 * onClickClose
	 */
	onClickClose(): void {
		this.updateNavigationService.updateMenuToggle(false);
	}

}

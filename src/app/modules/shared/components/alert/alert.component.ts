import { AlertButton } from './../../models/alert-button.model';
import { AlertService } from './../../services/alert.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

	@ViewChild('alertWrapper') alertWrapper!: ElementRef;

	/**
	 * constructor
	 */
	constructor(public alertService: AlertService) { }


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {
	}


	/**
	 * onClickClose
	 */
	onClickClose(): void {
		this.alertService.hideAlert();
	}

}

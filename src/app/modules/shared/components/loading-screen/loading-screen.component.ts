import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { LoadingService } from 'src/app/modules/core/services/loading.service';

@Component({
	selector: 'app-loading-screen',
	templateUrl: './loading-screen.component.html',
	styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {

	@ViewChild('loadingWrapper') loadingWrapper!: ElementRef;
	@Input() textUpper = 'Loading...';
	@Input() textLower = '';


	/**
	 * constructor
	 */
	constructor(public loadingService: LoadingService) { }


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {}



}

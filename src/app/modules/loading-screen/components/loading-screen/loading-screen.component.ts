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
	@Input() textUpper = '';
	@Input() textLower = '';

	constructor(public loadingService: LoadingService) { }

	ngOnInit(): void {

		if ( this.textUpper === '' ) {
			this.textUpper = 'Loading...';
		}

		// Only display the loading screen if the process takes longer than
		// 500 ms
		// window.setTimeout(
		// 	() => {
		// 		this.loadingWrapper.nativeElement.classList.add('show');
		// 	}, 500
		// );
	}



}

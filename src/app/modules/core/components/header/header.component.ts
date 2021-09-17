import { UpdateNavigationService } from './../../../core/services/update-navigation.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

	currentViewsubscription: Subscription = new Subscription;
	currentView: string = "";

	constructor(private updateNavigationService: UpdateNavigationService) {}

	ngOnInit(): void {
		this.currentViewsubscription = this.updateNavigationService.currentView.subscribe((currentView: string) => {
			this.currentView = currentView;
		});
	}

	onClickToggleMenu():void {
		this.updateNavigationService.updateMenuToggle(true);
	}

	ngOnDestroy(): void {
		this.currentViewsubscription.unsubscribe();
	}
}

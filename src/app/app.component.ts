import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UpdateNavigationService } from './modules/core/services/update-navigation.service';
import { EventHelperService } from './modules/shared/services/event-helper.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = 'metadata-annotation';
	currentMenuToggle: boolean = false;

	currentMenuTogglesubscription: Subscription = new Subscription;

	constructor(private updateNavigationService: UpdateNavigationService,
				private eventHelperService: EventHelperService) {}


	/**
	 * HostListener for document click on the entire page
	 * @param event
	 */
	@HostListener('document:click', ['$event'])
	documentClick(event: any): void {

		// Forward the click to the event helper service with the clicked target attached
		this.eventHelperService.triggerDocumentClick(event.target);

		// Remove tab_focus if mouse is used
		document.body.classList.remove('tab_focus');
	}


	/**
	 * HostListener for document keydown (tab key) on the entire page
	 * @param event
	 */
	@HostListener('document:keydown.tab', ['$event'])
	documentTab(event: any): void {

		// Add tab_focus to body if content is browsed with tab key
		document.body.classList.add('tab_focus');
	}

	ngOnInit():void {

		// Subscribe to the toggleMenu observable
		this.currentMenuTogglesubscription = this.updateNavigationService.currentMenuToggle.subscribe((manualToggle: boolean) => {

			if ( manualToggle ) {
				this.setCurrentMenuToggle(!!!this.currentMenuToggle);
			} else {
				this.setCurrentMenuToggle(false);
			}

		});
	}

	/**
	 * getCurrentMenuToggle
	 *
	 * Return the current toggle state of the menu
	 *
	 * @returns
	 */
	getCurrentMenuToggle(): boolean {
		return this.currentMenuToggle;
	}


	/**
	 * setCurrentMenuToggle
	 *
	 * Set the current toggle state of the menu
	 *
	 * @param show
	 */
	setCurrentMenuToggle(show: boolean): void {
		this.currentMenuToggle = show;
	}
}

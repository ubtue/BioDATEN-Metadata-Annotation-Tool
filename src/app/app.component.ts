import { AlertService } from './modules/shared/services/alert.service';
import { Platform } from '@angular/cdk/platform';
import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UpdateNavigationService } from './modules/core/services/update-navigation.service';
import { EventHelperService } from './modules/shared/services/event-helper.service';
import { SettingsService } from './modules/shared/services/settings.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

	title = 'metadata-annotation';
	currentMenuToggle: boolean = false;

	currentMenuTogglesubscription: Subscription = new Subscription;

	/**
	 * constructor
	 */
	constructor(private updateNavigationService: UpdateNavigationService,
				private eventHelperService: EventHelperService,
				private platform: Platform,
				private alertService: AlertService,
				private settingsService: SettingsService) {}


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

	/**
	 * ngOnInit
	 */
	ngOnInit():void {

		// Override the global alert function
		// Use the custom alert instead
		window.alert = (message: string) => {
			this.alertService.showAlert(this.settingsService.defaultAlertHeaderText, message);
		}

		// Subscribe to the toggleMenu observable
		this.currentMenuTogglesubscription = this.updateNavigationService.currentMenuToggle.subscribe((manualToggle: boolean) => {

			if ( manualToggle ) {
				this.setCurrentMenuToggle(!!!this.currentMenuToggle);
			} else {
				this.setCurrentMenuToggle(false);
			}

		});

		// If the Browser is Chrome or Edge > v79 (blink) or a webkit Browser
		// add a flag for supporting @property in CSS
		if ( this.platform.BLINK || this.platform.WEBKIT ) {
			document.body.classList.add('css_property_support');
		}
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

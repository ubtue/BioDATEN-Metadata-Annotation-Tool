import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UpdateNavigationService } from './modules/shared/services/update-navigation.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = 'metadata-annotation';
	currentMenuToggle: boolean = false;

	currentMenuTogglesubscription: Subscription = new Subscription;

	constructor(private updateNavigationService: UpdateNavigationService) {}

	ngOnInit():void {

		// Subscribe to the toggleMenu observable
		this.currentMenuTogglesubscription = this.updateNavigationService.currentMenuToggle.subscribe((manualToggle: boolean) => {

			if ( manualToggle ) {
				this.setCurrentMenuToggle(!!!this.currentMenuToggle);
			} else {
				this.setCurrentMenuToggle(false);
			}

		});

		// Add tab_focus to body if content is browsed with tab key
		document.body.addEventListener('keydown', function(event) {
			if ( event.key === 'Tab' ) {
				document.body.classList.add('tab_focus');
			}
		});

		// Remove tab_focus if mouse is used
		document.body.addEventListener('mousedown', function(event) {
			document.body.classList.remove('tab_focus');
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

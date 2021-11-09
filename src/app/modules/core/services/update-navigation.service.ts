import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UpdateNavigationService {

	private currentViewSubject = new BehaviorSubject({label: "", value: ""});
	currentView = this.currentViewSubject.asObservable();

	private toggleMenuSubject = new BehaviorSubject(false);
	currentMenuToggle = this.toggleMenuSubject.asObservable();


	/**
	 * constructor
	 */
	constructor() {}


	/**
	 * updateCurrentView
	 *
	 * Updates the navigation text
	 *
	 * @param currentView
	 */
	updateCurrentView(currentViewLabel: string, currentViewValue: string) {
		this.currentViewSubject.next({label: currentViewLabel, value: currentViewValue});
	}


	/**
	 * updateMenuToggle
	 *
	 * Shows/hides the menu
	 *
	 * @param show
	 */
	updateMenuToggle(manualToggle?: boolean) {

		// If the toggle is triggered manually -> toggle it normally, else close the menu
		if ( typeof manualToggle !== 'undefined' ) {
			this.toggleMenuSubject.next(manualToggle);
		} else {
			this.toggleMenuSubject.next(false);
		}


	}
}

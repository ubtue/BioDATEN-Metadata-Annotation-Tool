import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UpdateNavigationService {

	private currentViewSubject = new BehaviorSubject("#placeholder");
	currentView = this.currentViewSubject.asObservable();

	private toggleMenuSubject = new BehaviorSubject(false);
	currentMenuToggle = this.toggleMenuSubject.asObservable();

	constructor() {}


	/**
	 * updateCurrentView
	 *
	 * Updates the navigation text
	 *
	 * @param currentView
	 */
	updateCurrentView(currentView: string) {
		this.currentViewSubject.next(currentView);
	}


	/**
	 * updateMenuToggle
	 *
	 * shows/hides the menu
	 *
	 * @param show
	 */
	updateMenuToggle(manualToggle?: boolean) {

		// if the toggle is triggered manually -> toggle it normally, else close the menu
		if ( typeof manualToggle !== 'undefined' ) {
			this.toggleMenuSubject.next(manualToggle);
		} else {
			this.toggleMenuSubject.next(false);
		}


	}
}

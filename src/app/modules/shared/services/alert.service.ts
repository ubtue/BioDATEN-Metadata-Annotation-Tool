import { AlertButton } from './../models/alert-button.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AlertService {

	// Flag if alert is shown
	private isShowing$$ = new BehaviorSubject<boolean>(false);
	isShowing$ = this.isShowing$$.asObservable();

	// Header text
	private headerText$$ = new BehaviorSubject<string>('');
	headerText$ = this.headerText$$.asObservable();

	// Body text
	private bodyText$$ = new BehaviorSubject<string>('');
	bodyText$ = this.bodyText$$.asObservable();

	// Buttons (text + function)
	private buttons$$ = new BehaviorSubject<AlertButton[]>([]);
	buttons$ = this.buttons$$.asObservable();
	private buttons: AlertButton[] = [];

	// Flag for buttons
	private hasButtons$$ = new BehaviorSubject<boolean>(false);
	hasButtons$ = this.hasButtons$$.asObservable();

	constructor() { }


	/**
	 * setShow
	 * @param isShowing
	 */
	setShow(isShowing: boolean) {

		// Add/Remove class from body
		if ( isShowing ) {
			document.body.classList.add('alert-backdrop');
		} else {
			document.body.classList.remove('alert-backdrop');
		}

		this.isShowing$$.next(isShowing);
	}


	/**
	 * setHeaderText
	 * @param headerText
	 */
	setHeaderText(headerText: string) {
		this.headerText$$.next(headerText);
	}


	/**
	 * setHeaderText
	 * @param isShowing
	 */
	setBodyText(bodyText: string) {
		this.bodyText$$.next(bodyText);
	}


	/**
	 * addButton
	 *
	 * Adds a button to the alert box
	 *
	 * @param button
	 */
	addButton(button: AlertButton): void {

		// Add the button to the array and publish the array
		this.buttons.push(button);
		this.buttons$$.next(this.buttons);

		// Set the flag for buttons to true
		this.hasButtons$$.next(true);
	}


	clearButtons(): void {

		// Clear the array and publish it
		this.buttons = [];
		this.buttons$$.next(this.buttons);

		// Set the flag for buttons to false
		this.hasButtons$$.next(false);
	}


	/**
	 * showAlert
	 *
	 * Prompts the alert box
	 *
	 * @param header
	 * @param message
	 * @param buttons
	 */
	showAlert(header: string, message: string, buttons?: AlertButton[]): void {

		// Set the config
		this.setHeaderText(header);
		this.setBodyText(message);

		// Check if there are buttons and add them
		if ( buttons ) {

			buttons.forEach(
				(button: AlertButton) => {
					this.addButton(button);
				}
			);
		}

		// Show the alert
		this.setShow(true);
	}


	/**
	 * showLastAlert
	 *
	 * Shows the latest alert
	 */
	showLastAlert(): void {

		// Show the alert
		this.setShow(true);
	}


	/**
	 * hideAlert
	 *
	 * Hides the alert box
	 *
	 * @param preventClear
	 */
	hideAlert(preventClear?: boolean): void {

		// Remove the config if not prevented
		if ( !preventClear ) {

			this.setHeaderText('');
			this.setBodyText('');
			this.clearButtons();
		}

		// Hide the alert
		this.setShow(false);
	}
}

import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class FormValidationService {

	public readonly INVALID_INPUT_CLASS_NAME = 'invalid-input';

	/**
	 * constructor
	 */
	constructor(private alertService: AlertService,
				private settingsService: SettingsService) {
	}


	/**
	 * validate
	 *
	 * Validates the form and returns all input elements, that are not filled out correctly
	 */
	validate(): HTMLInputElement[] {

		// Get all the invalid elements
		let invalidElements = this.getAllInvalidRequiredInputElement();

		if ( this.settingsService.enableConsoleLogs ) {
			console.log('Invalid elements:');
			console.log(invalidElements);
		}

		// Mark the invalid elements
		this.markInvalidElements(invalidElements, 'This is a required input field.');

		return invalidElements;
	}


	/**
	 * getAllInvalidRequiredInputElement
	 *
	 * Gets all the invalid required input elements and returns them
	 *
	 * @returns
	 */
	getAllInvalidRequiredInputElement(): HTMLInputElement[] {

		let invalidElements: HTMLInputElement[] = [];

		// Get all required elements
		let requiredElements = document.querySelectorAll('input[required]');

		// Loop through the required elements
		for ( let i = 0; i < requiredElements.length; i++ ) {

			// Remove all input fields if they have a hidden parent
			if ( requiredElements[i].closest('[hidden]') ) {
				continue;
			}

			// Remove all input fields if they have a hidden-dependecy parent
			if ( requiredElements[i].closest('[dependency-hidden]') ) {
				continue;
			}

			// Remove all input fields if they have a parent that is not displayed
			if ( requiredElements[i].closest('[no-display]') ) {
				continue;
			}

			let requiredElement = requiredElements[i] as HTMLInputElement;

			// Check if the element has a value (if not -> invalid)
			if ( !requiredElement || !requiredElement.value ) {
				invalidElements.push(requiredElement);
			}
		}

		return invalidElements;
	}


	/**
	 * markInvalidElements
	 *
	 * Marks all the invalid input elements with a class and optionally with a text.
	 *
	 * @param invalidElements
	 * @param addText
	 */
	markInvalidElements(invalidElements: HTMLElement[] | HTMLInputElement[], addText?: string): void {

		// Clean up all the previous markings and event listeners
		this.cleanPreviousValidationMarking();

		// Loop through the elements and add the class invalid-input
		invalidElements.forEach(
			(element) => {
				element.classList.add(this.INVALID_INPUT_CLASS_NAME);

				// Add a text to the element?
				if ( addText && addText !== '' ) {

					let errorSpan = document.createElement('span');
					errorSpan.innerHTML = addText;
					errorSpan.classList.add('invalid-text-span');

					element.closest('label')?.parentNode?.appendChild(errorSpan);
				}

				// Add an event to the value change of this input
				element.addEventListener('change', this.invalidInputEventListerFunc);
			}
		);
	}


	/**
	 * checkIfAutocompleteIsValid
	 *
	 * Checks if the form is valid for submission. Returns either an invalid element or null if everything is valid
	 *
	 * @returns
	 */
	checkIfAutocompleteIsValid(): HTMLElement | null {

		// Get all inputs that have an identifier
		let inputs = document.querySelectorAll('input[data-autocomplete-flag="true"]');

		// Loop through all inputs
		for ( let i = 0; i < inputs.length; i++ ) {

			// Check if the valid flag is 0 -> return false
			if ( inputs[i].getAttribute('data-autocomplete-valid') === '0' ) {

				let input = inputs[i] as HTMLElement;

				// Show an alert telling the user that there is an invalid input
				this.alertService.showAlert(
					'Invalid Input',
					'There was at least one invalid input.<br>Please check your inputs.'
				);

				input.classList.add(this.INVALID_INPUT_CLASS_NAME);

				// Return the invalid input
				return input;
			}
		}

		// If there is no problem -> valid
		return null;
	}


	/**
	 * cleanPreviousValidationMarking
	 *
	 * Removes all the previous markings from the validation checks. This includes the invalid-input class, the event listeners for the inputs and the error text in the spans
	 */
	cleanPreviousValidationMarking(): void {

		// Remove all invalid-input classes and the event listener for change
		document.querySelectorAll('.' + this.INVALID_INPUT_CLASS_NAME).forEach(
			(input) => {

				// Remove the class
				input.classList.remove(this.INVALID_INPUT_CLASS_NAME);

				// Remove the event listener
				input.removeEventListener('change', this.invalidInputEventListerFunc);
			}
		);

		// Remove all invalid input spans
		document.querySelectorAll('.invalid-text-span').forEach(
			(textSpan) => {
				textSpan.remove();
			}
		);
	}


	/**
	 * invalidInputEventListerFunc
	 *
	 * Function that is triggered when the user makes an input in the invalid marked element. This removes the class, the error text as well as the event listener for the change
	 *
	 * @param event
	 */
	invalidInputEventListerFunc(event: Event): void {

		if ( event.target ) {

			let currentInputElement = event.target as HTMLInputElement;

			// Remove the invalid-input class
			currentInputElement.classList.remove('invalid-input');

			// Remove the error text span
			currentInputElement.closest('label')?.parentNode?.querySelector('.invalid-text-span')?.remove();

			// Remove the event listener after everything is done
			currentInputElement.removeEventListener('change', this.invalidInputEventListerFunc);
		}
	}
}

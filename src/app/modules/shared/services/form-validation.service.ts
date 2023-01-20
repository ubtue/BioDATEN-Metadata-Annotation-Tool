import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class FormValidationService {


	/**
	 * constructor
	 */
	constructor(private alertService: AlertService) {
	}

	validate(): void {
		console.log('Validating form...');
	}


	/**
	 * checkIfAutocompleteIsValid
	 *
	 * Checks if the form is valid for submission
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

				input.classList.add('invalid-input');

				// Return the invalid input
				return input;
			}
		}

		// If there is no problem -> valid
		return null;
	}

}

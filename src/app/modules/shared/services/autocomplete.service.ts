import { Injectable } from '@angular/core';
import { DataTransferService } from '../../core/services/data-transfer.service';

@Injectable({
	providedIn: 'root',
})
export class AutocompleteService {

	INIT_STATUS = {
		GET: 'getting',
		DONE: 'done'
	};

	dummyAutocompleteSource: string = '/assets/dummy-data/dummy-autocomplete.json';
	dummyAutocompleteSourceArray: string = '/assets/dummy-data/dummy-autocomplete-array';

	constructor(private dataTransferService: DataTransferService) {}

	handleAutocomplete(inputElement: HTMLElement): void {

		console.log('Handling autocomplete for:')
		console.log(inputElement);

		// Check if the input already has a autocomplete initiated
		if ( inputElement.hasAttribute('autocomplete-init') ) {

			// Handle the autocomplete
		} else {

			// init autocomplete for the element
			this.initNewAutocomplete(inputElement);
		}

	}

	initNewAutocomplete(inputElement: HTMLElement): void {
		console.log('Creating autocomplete for:');
		console.log(inputElement);

		// Set the state of the autocomplete-init to 'getting'
		this.setAutocompleteInitStatus(inputElement, this.INIT_STATUS.GET);

		let autocompleteSource: string = '';

		// Check for the autocomplete source. If there is none, take the dummy source
		if ( inputElement.getAttribute('data-autocomplete') ) {

			autocompleteSource = inputElement.getAttribute('data-autocomplete') as string;
		} else {

			// autocompleteSource = this.dummyAutocompleteSource;
			autocompleteSource = this.dummyAutocompleteSourceArray;
		}

		// Get the data for the autocomplete
		this.dataTransferService.getData(autocompleteSource).then(
			(dataResult: any) => {

				let autocompleteData: string[] = [];

				// Check if result is an array or not (it is asumed the result is an object then)
				if ( Array.isArray(dataResult) ) {

					autocompleteData = this.structureDataFromArray(dataResult);

				} else {

					autocompleteData = this.structureDataFromObject(dataResult);
				}



				// Set the state of the autocomplete-init to 'done'
				this.setAutocompleteInitStatus(inputElement, this.INIT_STATUS.DONE);
			}
		)
	}


	private structureDataFromArray(data: string[]): string[] {

		let result: string[] = [];

		result = data;

		return result;
	}


	private structureDataFromObject(data: Object): string[] {

		let result: string[] = [];

		result = Object.values(data);

		return result;
	}


	private setAutocompleteInitStatus(element: HTMLElement, status: string): void {
		element.setAttribute('autocomplete-init', status);
	}
}

import { HtmlHelperService } from './html-helper.service';
import { Injectable } from '@angular/core';
import { DataTransferService } from '../../core/services/data-transfer.service';

@Injectable({
	providedIn: 'root',
})
export class AutocompleteService {
	INIT_STATUS = {
		GET: 'getting',
		DONE: 'done',
	};

	documentClickInit: boolean = false;

	currentFocus: number = -1;

	dummyAutocompleteSource: string =
		'assets/dummy-data/dummy-autocomplete.json';
	dummyAutocompleteSourceArray: string =
		'assets/dummy-data/dummy-autocomplete-array';

	cachedAutocompleteData: any = [];


	/**
	 * constructor
	 */
	constructor(private dataTransferService: DataTransferService,
				private htmlHelperService: HtmlHelperService) {

		// If the document click event has not been initialized
		// make sure that a click on the document closes all lists except the one clicked
		if ( !this.documentClickInit ) {
			document.addEventListener("click", (e) => {
				this.closeAllLists(e.target as HTMLElement);
			});

			this.documentClickInit = true;
		}
	}


	/**
	 * handleAutocomplete
	 *
	 * Starting function that handles the autocomplete functionality
	 * for a given HTMLInputElement
	 *
	 * @param inputElement
	 */
	handleAutocomplete(inputElement: HTMLInputElement): void {
		console.log('Handling autocomplete for:');
		console.log(inputElement);

		// Check if the input already has a autocomplete initiated
		if ( this.checkIfAutocompleteInitIsComplete(inputElement) ) {

			// Handle the autocomplete
			// Get the data-index of the input element and call the autocomplete function
			let dataIndex = inputElement.getAttribute('data-autocomplete-index');

			if ( dataIndex ) {
				this.autocomplete(inputElement, parseInt(dataIndex));
			}

		} else if ( this.checkIfAutocompleteInitIsInProgress(inputElement) ) {

			// What to do here?
			/*TODO*/


		} else {

			// init autocomplete for the element
			this.initNewAutocomplete(inputElement);
		}
	}



	/**
	 * initNewAutocomplete
	 *
	 * Initializes the autocomplete functionality on a HTMLInputElement
	 * This function gets the complete data for the autocomplete for
	 * a specific HTMLInputElement and caches the data.
	 *
	 * @param inputElement
	 */
	initNewAutocomplete(inputElement: HTMLInputElement): void {
		console.log('Creating autocomplete for:');
		console.log(inputElement);

		// Set the state of the autocomplete-init to 'getting'
		this.setAutocompleteInitStatus(inputElement, this.INIT_STATUS.GET);

		let autocompleteSource: string = '';

		// Check for the autocomplete source. If there is none, take the dummy source
		if (inputElement.getAttribute('data-autocomplete')) {
			autocompleteSource = inputElement.getAttribute(
				'data-autocomplete'
			) as string;
		} else {
			// autocompleteSource = this.dummyAutocompleteSource;
			autocompleteSource = this.dummyAutocompleteSourceArray;
		}

		// Get the data for the autocomplete
		this.dataTransferService
			.getData(autocompleteSource, "text", true)
			.then((dataResult: any) => {

				let autocompleteData: string[] = [];

				// Check if result is a string, an array or not (it is asumed the result is an object then)
				if ( typeof dataResult === 'string' ) {
					autocompleteData = this.structureDataFromString(dataResult);
				} else if (Array.isArray(dataResult)) {
					autocompleteData = this.structureDataFromArray(dataResult);
				} else {
					autocompleteData = this.structureDataFromObject(dataResult);
				}

				// Cache the data using the length of the cache array as index
				let dataIndex = this.cachedAutocompleteData.length;

				this.cachedAutocompleteData[dataIndex] = autocompleteData;

				let inputWrapper = document.createElement('div');
				inputWrapper.classList.add('autocomplete-wrapper');

				this.htmlHelperService.wrapNode(inputElement, inputWrapper);

				inputElement.focus();

				// Call the autocomplete function
				this.autocomplete(inputElement, dataIndex);

				// Activate the keydown handling
				this.handleKeyDown(inputElement, dataIndex);

				// Set the state of the autocomplete-init to 'done'
				this.setAutocompleteInitStatus(
					inputElement,
					this.INIT_STATUS.DONE
				);
			});
	}


	/**
	 * autocomplete
	 *
	 * Handles the creation/deletion of the dynamic DIVs that display the autocomplete
	 * values for the input element
	 *
	 * @param inputElement
	 * @param dataIndex
	 * @returns
	 */
	private autocomplete(inputElement: HTMLInputElement, dataIndex: number): void {

		let autocompleteDIV,
			matchingElementDIV,
			val = inputElement.value;

		/*close any already open lists of autocompleted values*/
		this.closeAllLists(inputElement);

		if (!val) {
			return;
		}

		let data = this.cachedAutocompleteData[dataIndex];

		this.currentFocus = -1;

		// Create a DIV element that will contain the items (values)
		autocompleteDIV = document.createElement('DIV');
		autocompleteDIV.setAttribute('id', dataIndex + '_autocomplete-list');
		autocompleteDIV.setAttribute('class', 'autocomplete-items');

		// Add the data-index to the input element
		inputElement.setAttribute('data-autocomplete-index', dataIndex.toString());

		// Append the DIV element as a child of the autocomplete container
		if ( inputElement !== null && inputElement.parentNode !== null ) {
			inputElement.parentNode.appendChild(autocompleteDIV);
		}

		// For each item in the array
		for (let i = 0; i < data.length; i++) {

			// Check if the item starts with the same letters as the text field value
			if (
				data[i].substr(0, val.length).toUpperCase() == val.toUpperCase()
			) {

				// Create a DIV element for each matching element
				matchingElementDIV = document.createElement('DIV') as HTMLElement;

				// Make the matching letters bold
				matchingElementDIV.innerHTML =
					'<strong>' + data[i].substr(0, val.length) + '</strong>';

				matchingElementDIV.innerHTML += data[i].substr(val.length);

				// Insert a input field that will hold the current array item's value
				matchingElementDIV.innerHTML += "<input type='hidden' value='" + data[i] + "'>";

				let _this = this;

				// Execute a function when the item is clicked or selected
				matchingElementDIV.addEventListener('click', function(e) {

					// Insert the value for the autocomplete text field
					inputElement.value = this.getElementsByTagName('input')[0].value;

					// Close the list of autocompleted values,
					// (or any other open lists of autocompleted values
					// _this.closeAllLists(inputElement);
				});

				autocompleteDIV.appendChild(matchingElementDIV);
			}
		}
	}


	/**
	 * handleKeyDown
	 *
	 * Handles the keydown event on the input with autocomplete
	 *
	 * @param inputElement
	 * @param dataIndex
	 */
	private handleKeyDown(inputElement: HTMLInputElement, dataIndex: number) {

		inputElement.addEventListener('keydown', (event) => {

			// Get the autocomplete list for the input
			let autocompleteContainer = document.getElementById(dataIndex + '_autocomplete-list');

			// Only use the handler code if the list is present.
			// This will prevent the code influencing the behaviour of the input
			// if there is no autocomplete data for the field or if the
			// autocomplete has been deactivated after initialising
			if ( autocompleteContainer ) {

				let autocompleteContainerContentDIVs = autocompleteContainer.getElementsByTagName("div");

				if (event.key == "ArrowDown") {

					// Prevent the Cursor from moving within the input
					event.preventDefault();

					// If the arrow DOWN key is pressed,
					// increase the currentFocus variable
					this.currentFocus++;

					// Make the current item more visible
					this.addActive(autocompleteContainerContentDIVs);

				} else if (event.key == "ArrowUp") {

					// Prevent the Cursor from moving within the input
					event.preventDefault();

					// If the arrow UP key is pressed,
					// decrease the currentFocus variable
					this.currentFocus--;

					// Make the current item more visible
					this.addActive(autocompleteContainerContentDIVs);

				} else if (event.key == "Enter") {

					// If the ENTER key is pressed, prevent the form from being submitted
					event.preventDefault();

					if (this.currentFocus > -1) {

						// and simulate a click on the "active" item:*/
						if (autocompleteContainerContentDIVs) autocompleteContainerContentDIVs[this.currentFocus].click();
					}
				}
			}


		});
	}


	private addActive(x: HTMLCollectionOf<HTMLDivElement>): void {
		/*a function to classify an item as "active":*/
		if (!x) return;
		/*start by removing the "active" class on all items:*/
		this.removeActive(x);
		if (this.currentFocus >= x.length) this.currentFocus = 0;
		if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[this.currentFocus].classList.add("autocomplete-active");
	}

	private removeActive(x: HTMLCollectionOf<HTMLDivElement>): void {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}


	/**
	 * closeAllLists
	 *
	 * Close all autocomplete lists in the document,
	 * except the one passed as the clickedElement argument.
	 *
	 * @param inputElement
	 * @param clickedElement
	 */
	private closeAllLists(inputElement?: HTMLElement | null, clickedElement?: HTMLElement | null) {

		// Find all lists and loop through them to find all lists that should be closed
		let allLists = document.getElementsByClassName("autocomplete-items");

		for (let i = 0; i < allLists.length; i++) {
		  	if ( clickedElement != allLists[i] && clickedElement != inputElement ) {
				allLists[i].parentNode!.removeChild(allLists[i]);
			}
		}
	}


	/**
	 * structureDataFromString
	 *
	 * Structurizes the data if it is from a string.
	 *
	 * @param data
	 * @returns
	 */
	private structureDataFromString(data: string): string[] {

		let result: string[] = [];

		result = data.replace(/\'/g, "").replace(/,\s/g, ",").split(",");
		// result = data.replace(/\'/g, "").split(",");

		return result;
	}


	/**
	 * structureDataFromArray
	 *
	 * Structurizes the data if it is from an array.
	 *
	 * @param data
	 * @returns
	 */
	private structureDataFromArray(data: string[]): string[] {
		let result: string[] = [];

		result = data;

		return result;
	}


	/**
	 * structureDataFromObject
	 *
	 * Structurizes the data if it is from an object.
	 *
	 * @param data
	 * @returns
	 */
	private structureDataFromObject(data: Object): string[] {
		let result: string[] = [];

		result = Object.values(data);

		return result;
	}


	/**
	 * setAutocompleteInitStatus
	 *
	 * Sets the status of the input element
	 *
	 * @param inputElement
	 * @param status
	 */
	private setAutocompleteInitStatus(inputElement: HTMLInputElement, status: string): void {
		inputElement.setAttribute('data-autocomplete-init', status);
	}


	/**
	 * getAutocompleteInitStatus
	 *
	 * Gets the status of the input element.
	 *
	 * @param inputElement
	 * @returns
	 */
	private getAutocompleteInitStatus(inputElement: HTMLInputElement): string | null {
		return inputElement.getAttribute('data-autocomplete-init');
	}


	/**
	 * checkIfAutocompleteNotInit
	 *
	 * Checks if the autocomplete has not yet been initialized for the input element.
	 *
	 * @param inputElement
	 * @returns
	 */
	public checkIfAutocompleteNotInit(inputElement: HTMLInputElement): boolean {

		if ( this.getAutocompleteInitStatus(inputElement) === null ) {
			return true;
		} else {
			return false;
		}
	}


	/**
	 * checkIfAutocompleteInitIsInProgress
	 *
	 * Checks if the autocomplete initialization for input element is still in progress.
	 *
	 * @param inputElement
	 * @returns
	 */
	public checkIfAutocompleteInitIsInProgress(inputElement: HTMLInputElement): boolean {

		if ( this.getAutocompleteInitStatus(inputElement) === this.INIT_STATUS.GET ) {
			return true;
		} else {
			return false;
		}
	}


	/**
	 * checkIfAutocompleteInitIsComplete
	 *
	 * Checks if the autocomplete initialization for the input element is completed.
	 *
	 * @param inputElement
	 * @returns
	 */
	public checkIfAutocompleteInitIsComplete(inputElement: HTMLInputElement): boolean {

		if ( this.getAutocompleteInitStatus(inputElement) === this.INIT_STATUS.DONE ) {
			return true;
		} else {
			return false;
		}
	}
}

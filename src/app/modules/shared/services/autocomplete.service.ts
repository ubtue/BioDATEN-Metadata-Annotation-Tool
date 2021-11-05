import { HelperService } from './helper.service';
import { AutocompleteData } from './../models/autocomplete-data.model';
import { AutocompleteServerData } from '../models/autocomplete-server-data.model';
import { HtmlHelperService } from './html-helper.service';
import { Injectable } from '@angular/core';
import { DataTransferService } from '../../core/services/data-transfer.service';
import { SettingsService } from './settings.service';
import { devOnlyGuardedExpression } from '@angular/compiler';

@Injectable({
	providedIn: 'root',
})
export class AutocompleteService {

	readonly INIT_STATUS = {
		GET: 'getting',
		DONE: 'done',
	};

	documentClickInit: boolean = false;

	currentFocus: number = -1;

	// dummyAutocompleteSource: string =
	// 	'assets/dummy-data/dummy-autocomplete.json';
	// dummyAutocompleteSource: string =
	// 	'assets/dummy-data/vocabulary_from_ncbitaxonOntology.json';
	// dummyAutocompleteSource: string =
	// 	'assets/dummy-data/vocabulary_test.json';
	dummyAutocompleteSource: string =
		'assets/dummy-data/ontologies/vocabulary_from_tissueOntology.json';

	dummyAutocompleteSourceArray: string =
		'assets/dummy-data/dummy-autocomplete-array';

	cachedAutocompleteData: any = [];


	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService,
		private dataTransferService: DataTransferService,
		private helperService: HelperService,
		private htmlHelperService: HtmlHelperService) {

		// If the document click event has not been initialized
		// make sure that a click on the document closes all lists except the one clicked
		if (!this.documentClickInit) {
			document.addEventListener("click", (e) => {
				this.closeAllLists(e.target as HTMLElement);
				this.removeDescriptionPopout();
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

		if (this.settingsService.enableConsoleLogs) {
			console.log('Handling autocomplete for:');
			console.log(inputElement);
		}

		// Check if the input already has a autocomplete initiated
		if (this.checkIfAutocompleteInitIsComplete(inputElement)) {

			// Handle the autocomplete
			// Get the data-index of the input element and call the autocomplete function
			let dataIndex = inputElement.getAttribute('data-autocomplete-index');

			if (dataIndex) {
				this.autocomplete(inputElement, parseInt(dataIndex));
			}

		} else if (this.checkIfAutocompleteInitIsInProgress(inputElement)) {

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

		if (this.settingsService.enableConsoleLogs) {
			console.log('Creating autocomplete for:');
			console.log(inputElement);
		}

		// Wrap the input element in a DIV container
		let inputWrapper = document.createElement('div');
		inputWrapper.classList.add('autocomplete-wrapper');

		this.htmlHelperService.wrapNode(inputElement, inputWrapper);

		// Set the state of the autocomplete-init to 'getting'
		this.setAutocompleteInitStatus(inputElement, this.INIT_STATUS.GET);

		let autocompleteSource: string = '';

		// Check for the autocomplete source. If there is none, take the dummy source
		if (inputElement.getAttribute('data-autocomplete')) {
			autocompleteSource = inputElement.getAttribute(
				'data-autocomplete'
			) as string;
		} else {
			autocompleteSource = this.dummyAutocompleteSource;
			// autocompleteSource = this.dummyAutocompleteSourceArray;
		}

		// Get the data for the autocomplete
		this.dataTransferService
			.getData(autocompleteSource, "json", true)
			.then((dataResult: any) => {

				let autocompleteData: AutocompleteData[] = [];

				// Check if result is a string, an array or not (it is asumed the result is an object then)
				if (typeof dataResult === 'string') {
					// autocompleteData = this.structureDataFromString(dataResult);
				} else if (Array.isArray(dataResult)) {
					// autocompleteData = this.structureDataFromArray(dataResult);
				} else {
					autocompleteData = this.structureDataFromObject(dataResult);
				}

				// Cache the data using the length of the cache array as index
				let dataIndex = this.cachedAutocompleteData.length;

				this.cachedAutocompleteData[dataIndex] = autocompleteData;

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
			matchingElementDIVText,
			popoutDescriptionDIV,
			val = inputElement.value;

		/*close any already open lists of autocompleted values*/
		this.closeAllLists(inputElement);

		this.removeDescriptionPopout();

		if (!val) {
			return;
		}

		let data = this.cachedAutocompleteData[dataIndex] as AutocompleteData[];

		this.currentFocus = -1;

		// Create a DIV element that will contain the items (values)
		autocompleteDIV = document.createElement('DIV');
		autocompleteDIV.setAttribute('id', dataIndex + '_autocomplete-list');

		// Set classes
		autocompleteDIV.classList.add('autocomplete-items');

		// Description mode
		if ( this.settingsService.descriptionMode === this.settingsService.DESCRIPTION_MODE_INLINE ) {

			// Inline
			autocompleteDIV.classList.add('description-inline');

		} else if ( this.settingsService.descriptionMode === this.settingsService.DESCRIPTION_MODE_POPOUT ) {

			// Popout
			autocompleteDIV.classList.add('description-popout');
		}

		// Add the data-index to the input element
		inputElement.setAttribute('data-autocomplete-index', dataIndex.toString());

		// Append the DIV element as a child of the autocomplete container
		if (inputElement !== null && inputElement.parentNode !== null) {
			inputElement.parentNode.appendChild(autocompleteDIV);


			// Create a DIV for the popout description if set up
			if ( this.settingsService.descriptionMode === this.settingsService.DESCRIPTION_MODE_POPOUT ) {
				popoutDescriptionDIV = document.createElement('DIV');
				popoutDescriptionDIV.setAttribute('id', dataIndex + '_autocomplete-popout-description');
				popoutDescriptionDIV.classList.add('autocomplete-popout-description-wrap');

				inputElement.parentNode.appendChild(popoutDescriptionDIV);
			}
		}

		// For each item in the array
		for (let i = 0; i < data.length; i++) {

			// Check if the item starts with the same letters as the text field value
			if (
				data[i].label.substr(0, val.length).toUpperCase() == val.toUpperCase()
			) {

				// Create a DIV element for each matching element
				matchingElementDIV = document.createElement('DIV') as HTMLElement;
				matchingElementDIV.classList.add('autocomplete-element');

				// Create a DIV tag for the text
				matchingElementDIVText = document.createElement('DIV') as HTMLElement;
				matchingElementDIVText.classList.add('autocomplete-element-text');

				// Make the matching letters bold
				matchingElementDIVText.innerHTML +=
					'<strong>' + data[i].label.substr(0, val.length) + '</strong>';

				matchingElementDIVText.innerHTML += data[i].label.substr(val.length);

				// Insert a input field that will hold the current array item's label
				matchingElementDIVText.innerHTML += '<input type="hidden" name="label" value="' + data[i].label + '">';

				// Insert a input field that will hold the current array item's identifier
				matchingElementDIVText.innerHTML += '<input type="hidden" name="identifier" value="' + data[i].identifier + '">';

				// Insert text DIV into element DIV
				matchingElementDIV.appendChild(matchingElementDIVText);

				// If there is a description, add it acording to settings
				if (data[i].description && data[i].description !== '') {

					// Description style (inline | popout)
					if (this.settingsService.descriptionMode === this.settingsService.DESCRIPTION_MODE_INLINE) {

						// Inline description
						matchingElementDIV.innerHTML += "<p class=\"inline-description\">" + data[i].description + "</p>";

					} else if (this.settingsService.descriptionMode === this.settingsService.DESCRIPTION_MODE_POPOUT) {

						// Popout description
						matchingElementDIV.innerHTML +=
							"<div class=\"popout-description-icon\" data-description=\"" + data[i].description + "\">" +
								"<i class=\"material-icons\">info_outlined</i>" +
							"</div>";

					}

				}


				let _this = this;

				// Execute a function when the item is clicked or selected
				matchingElementDIV.addEventListener('click', function (e) {

					// Input element holding the label
					let valueInputElement = this.querySelector('input[name="label"]') as HTMLInputElement;

					// Insert the value for the autocomplete text field
					inputElement.value = valueInputElement.value;

					// Check if there is a identifier -> add it as a data-identifier to the input element
					let identifierInputElement = this.querySelector('input[name="identifier"]') as HTMLInputElement;

					if (identifierInputElement.value !== '') {
						inputElement.dataset.identifier = identifierInputElement.value;
					}

					// Remove all description popouts
					_this.removeDescriptionPopout();

					// Close the list of autocompleted values,
					// (or any other open lists of autocompleted values
					// _this.closeAllLists(inputElement);
				});


				// Popout description?
				if (this.settingsService.descriptionMode === this.settingsService.DESCRIPTION_MODE_POPOUT) {

					// Add a Eventlistener for the info icon on mouseover and mouseout
					let infoIcon = matchingElementDIV.querySelector('.popout-description-icon') as HTMLElement;

					if ( infoIcon ) {

						let parentElement = infoIcon.parentElement as HTMLElement;

						// Mouseover -> show description
						infoIcon.addEventListener('mouseover', function(e) {

							if ( parentElement ) {
								_this.showElementDescriptionInPopout(parentElement, dataIndex);
							}
						});

						// Mouseout -> remove description
						infoIcon.addEventListener('mouseout', function(e) {

							if ( parentElement ) {
								_this.hideDescriptionPopout(dataIndex);
							}
						});
					}

				}

				// Add the complete construct to the parent DIV
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
			if (autocompleteContainer) {

				let autocompleteContainerContentDIVs = autocompleteContainer.querySelectorAll("div.autocomplete-element");

				if (event.key === "ArrowDown") {

					// Prevent the Cursor from moving within the input
					event.preventDefault();

					// If the arrow DOWN key is pressed,
					// increase the currentFocus variable
					this.currentFocus++;

					// Make the current item more visible
					this.addActive(autocompleteContainerContentDIVs, dataIndex);

				} else if (event.key === "ArrowUp") {

					// Prevent the Cursor from moving within the input
					event.preventDefault();

					// If the arrow UP key is pressed,
					// decrease the currentFocus variable
					this.currentFocus--;

					// Make the current item more visible
					this.addActive(autocompleteContainerContentDIVs, dataIndex);

				} else if (event.key === "Enter") {

					// If the ENTER key is pressed, prevent the form from being submitted
					event.preventDefault();

					if (this.currentFocus > -1) {

						// and simulate a click on the "active" item
						if (autocompleteContainerContentDIVs) {

							let currentFocus = autocompleteContainerContentDIVs[this.currentFocus] as HTMLElement;

							currentFocus.click();
						}
					}
				} else if (event.key === "Esc" || event.key === "Escape") {

					// If the ESCAPE key is pressed, close the list
					event.preventDefault();

					this.closeAllLists(inputElement);

					this.removeDescriptionPopout();
				}

			}


		});
	}


	/**
	 * addActive
	 *
	 * Add the autocomplete-active class to the active div
	 *
	 * @param elements
	 * @param dataIndex
	 * @returns
	 */
	private addActive(elements: NodeListOf<Element>, dataIndex?: number): void {

		// If no elements were found just return
		if (!elements) return;

		// Remove the active class from all divs
		this.removeActive(elements);

		// If the saved focus is greater or equal to the amount of elements
		// (e.g. if the user navigates "down" from the last element)
		// Set the focus to 0 (first element)
		if (this.currentFocus >= elements.length) {
			this.currentFocus = 0;
		}

		// If the focus is smaller than 0 (e.g. user navigated "up" from first element)
		// Set the focus to the last element
		if (this.currentFocus < 0) {
			this.currentFocus = (elements.length - 1);
		}

		// Add the class autocomplete-active to the focused element
		elements[this.currentFocus].classList.add("autocomplete-active");

		// Popout description?
		if ( this.settingsService.descriptionMode === this.settingsService.DESCRIPTION_MODE_POPOUT ) {

			// Check if element has description and set the popout text and visibilty
			let element = elements[this.currentFocus] as HTMLElement;

			if ( typeof dataIndex !== 'undefined' ) {
				this.showElementDescriptionInPopout(element, dataIndex);
			}

		}

		// Scroll the element into view
		elements[this.currentFocus].scrollIntoView({ block: "nearest", inline: "nearest" });
	}


	/**
	 * removeActive
	 *
	 * Removes the autocomplete-active class from the divs
	 *
	 * @param elements
	 */
	private removeActive(elements: NodeListOf<Element>): void {

		// Loopt through all divs and remove the class autocomplete-active
		for (var i = 0; i < elements.length; i++) {
			elements[i].classList.remove("autocomplete-active");
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
			if (clickedElement != allLists[i] && clickedElement != inputElement) {
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
	private structureDataFromObject(data: AutocompleteServerData): AutocompleteData[] {

		let result: AutocompleteData[] = [];

		// Check if results and bindings exist
		if (data.results !== null && data.results.bindings !== null) {

			let bindings = data.results.bindings;

			// Sort items?
			if (this.settingsService.frontendSorting) {
				bindings = this.helperService.sort('label.value', bindings);
			}

			// Loop through all bindings and get the results back
			for (const key in bindings) {

				const bindingsData = bindings[key];

				// Get the values of the label, identifier and description
				result.push({
					identifier: bindingsData.identifier && bindingsData.identifier.value ? bindingsData.identifier.value : '',
					label: bindingsData.label && bindingsData.label.value ? bindingsData.label.value : '',
					description: bindingsData.description && bindingsData.description.value ? bindingsData.description.value : ''
				});

			}
		}

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
		inputElement.parentElement?.setAttribute('data-autocomplete-init', status);
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

		if (this.getAutocompleteInitStatus(inputElement) === null) {
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

		if (this.getAutocompleteInitStatus(inputElement) === this.INIT_STATUS.GET) {
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

		if (this.getAutocompleteInitStatus(inputElement) === this.INIT_STATUS.DONE) {
			return true;
		} else {
			return false;
		}
	}


	/**
	 * getElementDescription
	 *
	 * Gets the description within an element
	 *
	 * @param element
	 * @returns
	 */
	private getElementDescription(element: HTMLElement): string {

		let description: string = '';

		// Check if there is an element with a description and get the description
		if ( element.querySelector('[data-description]') && element.querySelector('[data-description]')?.getAttribute('data-description') !== '' ) {

			description = element.querySelector('[data-description]')!.getAttribute('data-description') as string;
		}

		return description;
	}


	/**
	 * showElementDescriptionInPopout
	 *
	 * Shows the description of the element in the popout
	 *
	 * @param sourceElement
	 * @param dataIndex
	 */
	private showElementDescriptionInPopout(sourceElement: HTMLElement, dataIndex: number) {

		// Get the description
		let description = this.getElementDescription(sourceElement);

		// Put the text in the Popout
		let popout = document.getElementById(dataIndex + '_autocomplete-popout-description');

		if ( popout ) {
			popout.innerHTML = description;

			this.showDescriptionPopout(dataIndex, sourceElement);
		}
	}


	/**
	 * showDescriptionPopout
	 *
	 * Shows the description popout
	 *
	 * @param dataIndex
	 * @param sourceElement
	 */
	private showDescriptionPopout(dataIndex: number, sourceElement?: HTMLElement): void {

		// Put the text in the Popout
		let popout = document.getElementById(dataIndex + '_autocomplete-popout-description');

		if ( popout ) {



			// If a source element is passed, it should be used as the
			// reference for the top position of the popout
			if ( typeof sourceElement !== 'undefined' ) {
				this.positionPopoutRelativeToSourceElement(popout, sourceElement);
			} else {

				// Of there is no source element passed, show the popout
				popout.classList.add('show');
			}
		}
	}


	/**
	 * hideDescriptionPopout
	 *
	 * Hides a description popout
	 *
	 * @param dataIndex
	 */
	 private hideDescriptionPopout(dataIndex: number): void {

		let popout = document.getElementById(dataIndex + '_autocomplete-popout-description');

		if ( popout ) {
			popout.classList.remove('show');
		}
	}


	/**
	 * removeDescriptionPopout
	 *
	 * Removes one or all description popouts
	 *
	 * @param specificPopout
	 */
	private removeDescriptionPopout(specificPopout?: HTMLElement): void {

		// Remove specific popout?
		if ( specificPopout ) {
			specificPopout.remove();

		} else {

			// Remove all popouts
			let popouts = document.querySelectorAll('div.autocomplete-popout-description-wrap');

			if ( popouts ) {

				popouts.forEach(
					(popout: Element) => {
						popout.remove();
					}
				)
			}
		}
	}


	/**
	 * positionPopoutRelativeToSourceElement
	 *
	 * Positions the popout element relative to the source element
	 *
	 * @param popout
	 * @param sourceElement
	 */
	private positionPopoutRelativeToSourceElement(popout: HTMLElement, sourceElement: HTMLElement): void {

		// Do both exist?
		if ( popout && sourceElement ) {

			// Get all the relevant positions and coords
			let sourceElementRelativeTop = sourceElement.offsetTop,
				sourceElementHeight = sourceElement.offsetHeight,
				popoutHeight = popout.offsetHeight;

			// Calculate the top position of the popout:
			// Relative top of the source element + source element height - (parent input height + borders (3x))
			// minus popout height / 2
			// plus source element height / 2
			let topPosition = 	Math.round((sourceElementRelativeTop + sourceElementHeight - 19)) -
								Math.round((popoutHeight / 2)) +
								Math.round((sourceElementHeight / 2 ));

			// minus the scrolltop of the scrollable parent in a timeout
			// because it takes the browser a few ms to scroll the parent
			window.setTimeout(
				() => {
					topPosition -= Math.round(sourceElement.parentElement!.scrollTop);

					// Set the top position and show the popout
					popout.style.top = topPosition + 'px';

					popout.classList.add('show');
				}, 10
			);


		}
	}
}

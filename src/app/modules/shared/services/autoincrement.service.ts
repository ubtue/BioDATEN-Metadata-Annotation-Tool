import { SettingsService } from './settings.service';
import { Injectable, NgModuleRef } from "@angular/core";

@Injectable({
	providedIn: 'root',
})
export class AutoincrementService {

	firstInitDone: boolean = false;

	addButtonBind: any = null;
	removeButtonBind: any = null;

	/**
	* constructor
	*/
	constructor(private settingsService: SettingsService) {}


	/**
	 * handleAutoincrement
	 *
	 * Handles the autoincrement of the inputs in the form
	 */
	handleAutoincrement(): void {

		// Only to this if this is the first time calling the function
		if ( this.firstInitDone === false ) {

			// Set the flag, that the first init is done
			this.firstInitDone = true;

			// Init the drop down elements
			this.initDropDowns();

			// Add an event listener to the custom event that triggers when a new section is added via the add button on the form
			// This workaround with the bind and the function has to be used because of a weird functionality in Angular
			// when lazy loading is active and a component ist destroyed. The attached module content will not be destroyed with it
			// See clear function in this service
			this.addButtonBind = this.addButtonFunction.bind(this);
			window.addEventListener('xsd2html2xml-add-button', this.addButtonBind);

			// Add an event listener to the custom event that triggers when a section is removed via the remove button on the form
			// This workaround with the bind and the function has to be used because of a weird functionality in Angular
			// when lazy loading is active and a component ist destroyed. The attached module content will not be destroyed with it
			// See clear function in this service
			this.removeButtonBind = this.removeButtonFunction.bind(this);
			window.addEventListener('xsd2html2xml-remove-button', this.removeButtonBind);
		}

		// Get all the autoincrement elements
		let autoincrementElements = this.getAllAutoincrementElements();

		if ( autoincrementElements.length > 0 ) {

			// Fill out the empty auto increment inputs
			this.fillEmptyAutoincrement(autoincrementElements);

			// Refresh the drop downs
			this.refreshDropDowns();
		}
	}


	/**
	 * addButtonFunction
	 *
	 * Function that is triggered when the add button is clicked
	 */
	addButtonFunction(): void {

		// If the add button is used, call the handle the autoincrement for the new elements
		this.handleAutoincrement();
	}


	/**
	 * removeButtonFunction
	 *
	 * Function that is triggered when the remove button is clicked
	 */
	removeButtonFunction(): void {

		// If a section is removed refresh the dropdowns
		this.refreshDropDowns();
	}


	/**
	 * fillEmptyAutoincrement
	 *
	 * Fills out the empty auto increment inputs
	 * It checks for the highest used value (id) within a specifig part of the form and counts the id values up.
	 *
	 * @param autoincrementElements
	 */
	private fillEmptyAutoincrement(autoincrementElements: Element[]): void {

		// Loop through all the elements
		for ( let i = 0; i < autoincrementElements.length; i++ ) {

			let currentElement = autoincrementElements[i];

			// Find the input for the element
			let autoincrementInput = currentElement.querySelector('input') as HTMLInputElement | null;

			// Check if the input exists and if its value is empty (only empty elements are important)
			if ( autoincrementInput !== null && autoincrementInput.value === '' ) {

				// Find the current highest value for the autoincrement of the current xpath
				// Get the xpath
				let xpath = currentElement.getAttribute('data-xsd2html2xml-xpath');

				if ( xpath !== '' ) {

					// Get all the elements with the current xpath
					let elementsWithSameXpath = document.querySelectorAll('[data-xsd2html2xml-xpath="' + xpath + '"]');

					if ( elementsWithSameXpath.length > 0 ) {

						// Find the highest value
						let highestValue = 0;

						for ( let j = 0; j < elementsWithSameXpath.length; j++ ) {

							// If the closest fieldset to the element is hidden, skip this element
							if ( elementsWithSameXpath[j].closest('fieldset') && elementsWithSameXpath[j].closest('fieldset')?.hasAttribute('hidden') ) {
								continue;
							}

							// Find the input for the element
							let highestAutoincrementInput = elementsWithSameXpath[j].querySelector('input') as HTMLInputElement | null;

							if ( highestAutoincrementInput !== null ) {

								// Get the value of the input as an integer
								let highestAutoincrementInputValue = parseInt(highestAutoincrementInput.value);

								// Check if the value is a number and higher than the highest so far -> new highest value
								if ( !Number.isNaN(highestAutoincrementInputValue) && highestAutoincrementInputValue > highestValue ) {
									highestValue = highestAutoincrementInputValue;
								}
							}
						}

						// Write the highest value + 1 into the input
						autoincrementInput.value = (highestValue + 1).toString();
					}
				}
			}
		}
	}


	/**
	 * getAllAutoincrementElements
	 *
	 * Gets all the elements of the form which are to be autoincremented
	 *
	 * @returns
	 */
	private getAllAutoincrementElements(): Element[] {

		let autoincrementElements: Element[] = [];

		// Get all elements with the data attribute data-xsd2html2xml-custom-autoincrement
		let elementsFromForm = document.querySelectorAll('[data-xsd2html2xml-custom-autoincrement="true"]:not([data-autoincrement-init="1"])');

		// Loop through all the elements from the form
		for ( let i = 0; i < elementsFromForm.length; i++ ) {

			// If the element exists, modify it and push it to the array
			if ( elementsFromForm !== null ) {

				// If the closest fieldset to the element is hidden, skip this element
				if ( elementsFromForm[i].closest('fieldset') && elementsFromForm[i].closest('fieldset')?.hasAttribute('hidden') ) {
					continue;
				}

				// Mark the element as initialized
				elementsFromForm[i].setAttribute('data-autoincrement-init', '1');

				// Disable the input element
				let autoincrementInput = elementsFromForm[i].querySelector('input') as HTMLInputElement | null;

				if ( autoincrementInput !== null ) {
					autoincrementInput.setAttribute('disabled', 'disabled');
				}

				autoincrementElements.push(elementsFromForm[i]);
			}
		}

		return autoincrementElements;
	}


	/**
	 * initDropDowns
	 *
	 * Initializes the dropdowns: In the schema file the fields can be markes as xs:string which leads to a input field instead of a select element
	 * This function takes the input fields and replaces them with select fields while preserving all the attributes attached to the input fields
	 */
	private initDropDowns(): void {

		// Get all elements, that can select the autoincrement elements
		let dropdownElements = document.querySelectorAll('[data-xsd2html2xml-custom-autoincrement-source]');

		if ( dropdownElements.length > 0 ) {

			// Loop through all elements and init the drop downs
			for ( let i = 0; i < dropdownElements.length; i++ ) {

				// Get the input field
				let inputField = dropdownElements[i].querySelector('input');

				if ( inputField ) {

					// Change the input element to a select element
					// Get all attributes of the input element
					let attributes = [];

					for (let j = 0, atts = inputField.attributes, n = atts.length; j < n; j++) {

						// Get the node name and value
						let nodeName = atts[j].nodeName?.toString() as string,
							nodeValue = atts[j].nodeValue?.toString() as string;

						// The onchange value needs to be changed
						if ( nodeName.toLowerCase() === 'onchange' ) {
							nodeValue = 'this.childNodes.forEach(function(o) { if (o.nodeType == Node.ELEMENT_NODE) o.removeAttribute("selected"); }); this.children[this.selectedIndex].setAttribute("selected","selected");'
						}

						// Get the attribute name and value
						let attribute = {
							name: nodeName,
							value: nodeValue
						}

						// Save it to the array
						attributes.push(attribute);
					}

					// Create a new select field with all the previews attributes
					let newSelectElement = document.createElement('select') as HTMLSelectElement;

					// Add the attributes
					for ( let j = 0; j < attributes.length; j++ ) {
						newSelectElement.setAttribute(attributes[j].name, attributes[j].value);
					}

					// Add the new select element to the html
					inputField.parentNode?.insertBefore(newSelectElement, inputField.nextElementSibling);

					// Remove the input element
					inputField.remove();
				}
			}
		}
	}


	/**
	 * refreshDropDowns
	 *
	 * Refreshes all the dropdowns and its options by scanning the form for relevant input fields and taking the data from there to the select field
	 */
	private refreshDropDowns(): void {

		// Get all elements, that can select the autoincrement elements
		let dropdownElements = document.querySelectorAll('[data-xsd2html2xml-custom-autoincrement-source]');

		if ( dropdownElements.length > 0 ) {

			// Loop through all elements and init the drop downs
			for ( let i = 0; i < dropdownElements.length; i++ ) {

				// Gather all the values in this array
				let allAutoincrementValues: string[] = [];

				// Get the corresponding element name
				let correspondingAutoincrementSourceElementName = dropdownElements[i].getAttribute('data-xsd2html2xml-custom-autoincrement-source');

				if ( correspondingAutoincrementSourceElementName && correspondingAutoincrementSourceElementName !== '' ) {

					// Get all elements with the corresponding name
					let correspondingAutoincrementSourceElements = document.querySelectorAll('[data-xsd2html2xml-name="' + correspondingAutoincrementSourceElementName + '"]');

					if ( correspondingAutoincrementSourceElements.length > 0 ) {

						// Loop through all elements and gather the values of the inputs
						for ( let j = 0; j < correspondingAutoincrementSourceElements.length; j++ ) {

							// Get the input element
							let correspondingAutoincrementInput = correspondingAutoincrementSourceElements[j].querySelector('input') as HTMLInputElement;

							if ( correspondingAutoincrementInput && correspondingAutoincrementInput.value !== '' ) {
								allAutoincrementValues.push(correspondingAutoincrementInput.value);
							}
						}
					}
				}

				// Get the select element
				let selectElement = dropdownElements[i].querySelector('select') as HTMLSelectElement;

				if ( selectElement ) {

					// Get currently selected option
					let currentlySelectedOption = selectElement.value;

					// Delete all current options
					let options = selectElement.querySelectorAll('option');
					options.forEach(o => o.remove());

					// Add the options to the select element
					if ( allAutoincrementValues.length > 0 ) {

						for ( let j = 0; j < allAutoincrementValues.length; j++ ) {

							// Create the option and add it to the select
							let option = document.createElement('option');
							option.value = allAutoincrementValues[j];
							option.text = allAutoincrementValues[j];

							// Check if the option was selected and re select it
							if ( currentlySelectedOption === allAutoincrementValues[j] ) {
								option.selected = true;
							}

							selectElement.add(option);
						}
					}
				}
			}
		}
	}


	/**
	 * clearEverything
	 *
	 * Removes all events and attributes created by this module
	 *
	 * Note: This is needed because Angular does NOT remove everything from a module that is loaded in a component when its destroyed if lazy loading is used
	 */
	clearEverything(): void {

		// Add an event listener to the custom event that triggers when a new section is added via the add button on the form
		window.removeEventListener('xsd2html2xml-add-button', this.addButtonBind);

		// Add an event listener to the custom event that triggers when a section is removed via the remove button on the form
		window.removeEventListener('xsd2html2xml-remove-button', this.removeButtonBind);

		document.querySelectorAll('[data-autoincrement-init]').forEach(
			(element: Element) => {
				element?.removeAttribute('data-autoincrement-init');
			}
		);

		this.firstInitDone = false;
	}
}

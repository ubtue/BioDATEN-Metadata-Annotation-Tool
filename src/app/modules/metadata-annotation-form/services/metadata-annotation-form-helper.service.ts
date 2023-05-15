import { AlertService } from './../../shared/services/alert.service';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { HelperService } from './../../shared/services/helper.service';
import { MetadataCreatedTab } from './../../shared/models/metadata-created-tab.model';
import { Injectable } from '@angular/core';
import { DataTransferService } from '../../core/services/data-transfer.service';

@Injectable({
	providedIn: 'root',
})
export class MetadataAnnotationFormHelperService {

	/**
	 * constructor
	 */
	constructor(private helperService: HelperService,
				private dataTransferService: DataTransferService,
				private settingsService: SettingsService,
				private alertService: AlertService) {

					if ( this.settingsService.metadataAnnotationFormFlexLayout === true ) {
						document.body.classList.add('metadata-form-flex-layout');
					}
				}


	/**
	 * changeValuesToIdentifier
	 *
	 * Changes the values of the inputs to the identifier for
	 * saving it to the xml
	 */
	changeValuesToIdentifier(): void {

		// Get all inputs that have an identifier
		let inputs = document.querySelectorAll('input[data-identifier]');

		// Loop through all found inputs
		inputs.forEach(
			(input: Element) => {

				let thisInput = input as HTMLInputElement;

				if ( thisInput.getAttribute('data-identifier') !== null && thisInput.getAttribute('data-identifier') !== '' ) {

					// Get the identifier and the current value
					let dataIdentifier = thisInput.getAttribute('data-identifier') as string;
					let currentValue = thisInput.value;

					// Put the value of the identifier in the value attribute
					thisInput.value = dataIdentifier;

					// Put the current value as a data-attr
					thisInput.setAttribute('data-pre-identifier-value', currentValue);
				}
			}
		)
	}


	/**
	 * changeIdentifierToValues
	 *
	 * Changes the identifier of the inputs to the before values
	 */
	changeIdentifierToValues(): void {

		// Get all inputs that have an pre identifier value
		let inputs = document.querySelectorAll('input[data-pre-identifier-value]');

		// Loop through all found inputs
		inputs.forEach(
			(input: Element) => {

				let thisInput = input as HTMLInputElement;

				if ( thisInput.getAttribute('data-pre-identifier-value') !== null && thisInput.getAttribute('data-pre-identifier-value') !== '' ) {

					// Get the pre identifier value and the current value (identifier)
					let preIdentifierValue = thisInput.getAttribute('data-pre-identifier-value') as string;
					let identifier = thisInput.value;

					// Put the value of the pre identifier value in the value attribute
					thisInput.value = preIdentifierValue;

					// Remove the data-pre-identifier-value and set the identifier as data-attr
					thisInput.setAttribute('data-pre-identifier-value', '');
					thisInput.setAttribute('data-identifier', identifier);
				}
			}
		)
	}


	/**
	 * createXMLData
	 *
	 * Creates the XML data from all created tabs
	 *
	 * @param tabs
	 * @returns
	 */
	createXMLData(tabs: MetadataCreatedTab[]): string {

		let xmlData = '';

		// Loop through every tab an save the data
		if ( tabs.length > 0 ) {

			// Change the values to the identifier for saving
			this.changeValuesToIdentifier();

			tabs.forEach((createdTab: MetadataCreatedTab) => {

				if ( createdTab.tabContent?.contentElement?.querySelector('form.xsd2html2xml') ) {

					// Get the filename of the schema
					let schemaFilename = createdTab.tabContent?.contentElement?.querySelector('span[data-schema-file]')?.getAttribute('data-schema-file') as string;

					if ( schemaFilename ) {

						// Get the XML data of the tab
						xmlData += (window as any)['xsd2html2xml'][this.helperService.removeFileExtension(schemaFilename)].htmlToXML(
							createdTab.tabContent?.contentElement?.querySelector('form.xsd2html2xml'),
							'newSchema schema="' + this.helperService.removeFileExtension(schemaFilename) + '"',
							'newSchema'
						)
					}
				}
			});

			// Change the values back to their values before the change
			this.changeIdentifierToValues();
		}

		return xmlData;
	}


	/**
	 * replaceOntologyIdentifiers
	 *
	 * Replaces all input values (identifier -> value) and keeps the identifier as a data attribute
	 */
	replaceOntologyIdentifiers(): void {

		// Get all input elements that have a ontology identifier as value
		let inputElementsWithOntologyIdentifiers = this.getAllInputsWithOntologyIdentifiers();

		inputElementsWithOntologyIdentifiers.forEach(
			(inputElement: HTMLInputElement) => {

				if ( inputElement ) {

					// Bioportal Mode
					if ( this.settingsService.autocompleteMode === this.settingsService.AUTOCOMPLETE_MODE_BIOPORTAL ) {

						// Check if preIdentValue attribute is present
						if ( inputElement.getAttribute('data-xsd2html2xml-pre-filled-value-autocomplete') ) {

							// Set the current value as identifier
							inputElement.setAttribute('data-identifier', inputElement.value);

							let preIdentValue = inputElement.getAttribute('data-xsd2html2xml-pre-filled-value-autocomplete') as string

							// Change the value to the preIdentValue
							inputElement.value = preIdentValue;

							// Also add the attribute data-pre-identifier-value and fill the preIdentValue
							inputElement.setAttribute('data-pre-identifier-value', preIdentValue);
						}
					}

					// JSON Mode
					if ( this.settingsService.autocompleteMode === this.settingsService.AUTOCOMPLETE_MODE_JSON ) {
						let ontology = inputElement.getAttribute('data-ontology');

						if ( ontology && ontology !== '' ) {

							// Find the corresponding label
							this.getOntologyLabelByIdentifier(inputElement.value, ontology).then(
								(result: any) => {

									if ( result ) {
										// Set the current value as identifier
										inputElement.setAttribute('data-identifier', inputElement.value);

										// Change the value to the label
										inputElement.value = result;
									}
								}
							);
						}
					}
				}
			}
		);
	}


	/**
	 * getAllInputsWithOntologyIdentifiers
	 *
	 * Gets all inputs that have an ontology identifier as value
	 *
	 * @returns
	 */
	getAllInputsWithOntologyIdentifiers(): HTMLInputElement[] {

		let resultInputs: HTMLInputElement[] = [];

		// Get all inputs that have a linked ontology
		let inputsWithOntology = document.querySelectorAll('input');

		// Loop through the inputs
		inputsWithOntology.forEach(
			(input: Element) => {

				if ( input ) {
					let thisInput = input as HTMLInputElement;

					// Does this input have a value that fits the ontology criteria?
					let regEx = /\b(https?:\/\/.*?\.[a-z]{2,4}\/[^\s]*\b)/g;

					if ( thisInput.value !== '' && thisInput.value.match(regEx) ) {
						resultInputs.push(thisInput);
					}
				}
			}
		);

		return resultInputs;
	}


	/**
	 * getOntologyLabelByIdentifier
	 *
	 * Looks through an ontology and searches for a label that matches the
	 * given identifier
	 *
	 * @param identifier
	 * @param ontology
	 * @returns
	 */
	getOntologyLabelByIdentifier(identifier: string, ontology: any): Promise<string> {

		return this.dataTransferService
			.getData(ontology, "json", true)
			.then((data: any) => {

				let result: string = identifier;

				// Check if results and bindings exist
				if (data && data.results !== null && data.results.bindings !== null) {

					let bindings = data.results.bindings;

					// Loop through all bindings and get the results back
					for (const key in bindings) {

						const bindingsData = bindings[key];

						// If the identifier value matches and it has a corresponding value -> exit loop
						if ( bindingsData.identifier && bindingsData.identifier.value === identifier
							&& bindingsData.label && bindingsData.label.value ) {

								result = bindingsData.label.value;

								break;
						}
					}
				}

				return result;
			});
	}
}

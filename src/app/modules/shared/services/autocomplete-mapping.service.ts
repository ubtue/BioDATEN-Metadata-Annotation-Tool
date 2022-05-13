import { AutocompleteSchema } from './../models/autocomplete-schema.model';
import { HttpHeaders } from '@angular/common/http';
import { AlertService } from './alert.service';
import { DataTransferService } from './../../core/services/data-transfer.service';
import { SettingsService } from './settings.service';
import { AutocompleteMapping } from './../models/autocomplete-mapping.model';
import { Injectable } from '@angular/core';
import { ElementSchemaRegistry } from '@angular/compiler';

@Injectable({
	providedIn: 'root',
})
export class AutocompleteMappingService {

	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService,
				private dataTransferService: DataTransferService,
				private alertService: AlertService) {}


	/**
	 * getAllMappings
	 *
	 * Gets all the mappings from the database
	 *
	 * @returns
	 */
	getAllMappings(): Promise<AutocompleteMapping[]> {

		return this.dataTransferService.getData(this.settingsService.autocompleteMappingServerAddress).then(
			(result: AutocompleteMapping[]) => {
				return result;
			}
		);
	}

	/**
	 * addNewMapping
	 *
	 * Adds new mapping to the database
	 */
	addNewMapping(schema: string, xpath: string, ontology:string, active: boolean): Promise<any> {

		// Check if the xpath already has been added (only continue if not)
		return this.xpathAlreadyExists(schema, xpath).then(
			(exists: boolean) => {

				if (!exists) {

					// Create params string
					let params = {
						'schema': schema,
						'xpath': xpath,
						'ontology': ontology,
						'active': active
					};

					let paramsString = JSON.stringify(params);

					// Create httpOpts (headers)
					let httpOpts = {
						headers: new HttpHeaders().set('Accept', '*/*').set('Content-Type', 'application/json')
					};

					// Send POST-Request
					return this.dataTransferService.postData(this.settingsService.autocompleteMappingServerAddress, paramsString, httpOpts);

				} else {

					// If there is already a mapping show a alert
					this.alertService.showAlert(
						'Add mapping',
						'A mapping for the xpath "' + xpath + '" already exists.<br />A duplicate entry is not allowed.'
					);

					return Promise.resolve(null);
				}
			}
		);
	}


	/**
	 * updateAutocompleteMapping
	 *
	 * Updates the saved ontology in the database
	 *
	 * @param mapping
	 * @param schema
	 * @param xpath
	 * @param ontology
	 * @param active
	 */
	updateAutocompleteMapping(mapping: AutocompleteMapping, schema: string, xpath: string, ontology: string, active: boolean): Promise<any> {

		// Create params string
		let params = {
			'id': mapping.id,
			'schema': schema,
			'xpath': xpath,
			'ontology': ontology,
			'active': active
		};

		let paramsString = JSON.stringify(params);

		// Create httpOpts (headers)
		let httpOpts = {
			headers: new HttpHeaders().set('Accept', '*/*').set('Content-Type', 'application/json')
		};

		// Check if the xpath of new element is the same as before
		if ( mapping.xpath === xpath ) {

			// Send PUT-Request
			return this.dataTransferService.putData(this.settingsService.autocompleteMappingServerAddress, paramsString, httpOpts);

		} else {

			// Check if the xpath already has been added (only continue if not)
			return this.xpathAlreadyExists(schema, xpath).then(
				(exists: boolean) => {

					if (!exists) {

						// Send PUT-Request
						return this.dataTransferService.putData(this.settingsService.autocompleteMappingServerAddress, paramsString, httpOpts);

					} else {

						// If there is already a mapping show a alert
						this.alertService.showAlert(
							'Update mapping',
							'A mapping for the xpath "' + xpath + '" already exists.<br />A duplicate entry is not allowed.'
						);

						return Promise.resolve(null);
					}
				}
			);
		}
	}


	/**
	 * deleteAutocompleteMapping
	 *
	 * Deletes the selected mapping in the database
	 *
	 * @param mapping
	 */
	deleteAutocompleteMapping(mapping: AutocompleteMapping): Promise<any> {

		return this.dataTransferService.deleteData(this.settingsService.autocompleteMappingServerAddress + mapping.id).then(
			(result: any) => {
				if ( this.settingsService.enableConsoleLogs ) {
					console.log(result);
				}
			}
		);
	}


	/**
	 * xpathAlreadyExists
	 *
	 * Checks if a ontology for the given xpath has already been added
	 *
	 * @param xpath
	 * @returns
	 */
	xpathAlreadyExists(schema: string, xpath: string): Promise<boolean> {

		return this.getAllMappings().then(
			(mappings: AutocompleteMapping[]) => {

				// If the value is in one of the datasources -> return true
				if (mappings.some((e: AutocompleteMapping) => (e.xpath === xpath && e.schema === schema)) ) {
					return true;
				}

				return false;
			}
		);
	}


	/**
	 * parseSchemasToMappings
	 *
	 * Parses the name of the schema into the mapping instead of the id
	 *
	 * @param schemas
	 * @param mappings
	 */
	parseSchemasToMappings(schemas: AutocompleteSchema[], mappings: AutocompleteMapping[]): AutocompleteMapping[] {

		let parsedMappings: AutocompleteMapping[] = [];

		// Loop through the mappings and replace the schema id with the schema name
		for ( let i = 0; i < mappings.length; i++ ) {

			let mapping = mappings[i];

			for ( let j = 0; j < schemas.length; j++ ) {

				let schema = schemas[j];

				// If the mapping schema id and the id of the schema match replace the value
				// and leave the inner loop
				if ( mapping.schema === schema.id ) {
					mapping.schema = schema.schema;

					parsedMappings.push(mapping);

					break;
				}
			}
		}

		return parsedMappings;
	}


	/**
	 * addOntologiesToInputs
	 *
	 * Adds the ontologies to inputs as a data attribute
	 *
	 * @param mappings
	 */
	addOntologiesToInputs(mappings: AutocompleteMapping[]):void {

		// Loop through all mappings and add
		for ( let i = 0; i < mappings.length; i++ ) {

			// Get input elements
			let inputElements = document.querySelectorAll(
				'div[data-tab="' + mappings[i].schema + '"] label[data-xsd2html2xml-xpath="' + mappings[i].xpath + '"] > input');

			// Loop through all elements
			for ( let j = 0; j < inputElements.length; j++ ) {

				let inputElement = inputElements[j] as HTMLInputElement;

				// Add ontology as data attribute if the element exists
				if ( inputElement ) {
					inputElement.setAttribute('data-ontology', mappings[i].ontology);

					// Disable the browser autocomplete for these inputs
					inputElement.setAttribute('autocomplete', 'off');
				}
			}
		}
	}
}

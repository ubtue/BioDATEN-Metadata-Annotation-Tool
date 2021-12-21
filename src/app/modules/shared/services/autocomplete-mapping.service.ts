import { HttpHeaders } from '@angular/common/http';
import { AlertService } from './alert.service';
import { DataTransferService } from './../../core/services/data-transfer.service';
import { SettingsService } from './settings.service';
import { AutocompleteMapping } from './../models/autocomplete-mapping.model';
import { Injectable } from '@angular/core';

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
	 addNewMapping(xpath: string, ontology:string): Promise<any> {

		// Check if the xpath already has been added (only continue if not)
		return this.xpathAlreadyExists(xpath).then(
			(exists: boolean) => {

				if (!exists) {

					// Create params string
					let params = {
						'xpath': xpath,
						'ontology': ontology
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
	 * @param xpath
	 * @param ontology
	 */
	updateAutocompleteMapping(mapping: AutocompleteMapping, xpath: string, ontology: string): Promise<any> {

		// Create params string
		let params = {
			'id': mapping.id,
			'xpath': xpath,
			'ontology': ontology
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
			return this.xpathAlreadyExists(xpath).then(
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

		return this.dataTransferService.deleteData(this.settingsService.autocompleteMappingServerAddress + mapping.id);
	}


	/**
	 * xpathAlreadyExists
	 *
	 * Checks if a ontology for the given xpath has already been added
	 *
	 * @param xpath
	 * @returns
	 */
	xpathAlreadyExists(xpath: string): Promise<boolean> {

		return this.getAllMappings().then(
			(mappings: AutocompleteMapping[]) => {

				// If the value is in one of the datasources -> return true
				if (mappings.some((e: AutocompleteMapping) => e.xpath === xpath) ) {
					return true;
				}

				return false;
			}
		);
	}
}

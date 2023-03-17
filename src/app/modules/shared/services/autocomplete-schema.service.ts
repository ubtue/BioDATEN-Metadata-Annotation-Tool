import { AutocompleteSchema } from './../models/autocomplete-schema.model';
import { HttpHeaders } from '@angular/common/http';
import { AlertService } from './alert.service';
import { DataTransferService } from '../../core/services/data-transfer.service';
import { SettingsService } from './settings.service';
import { Injectable } from '@angular/core';
import { ElementSchemaRegistry } from '@angular/compiler';
import { AutocompleteMapping } from '../models/autocomplete-mapping.model';


@Injectable({
	providedIn: 'root',
})
export class AutocompleteSchemaService {

	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService,
				private dataTransferService: DataTransferService,
				private alertService: AlertService) {}


	/**
	 * getAllSchemas
	 *
	 * Gets all the schemas from the database
	 *
	 * @returns
	 */
	getAllSchemas(): Promise<AutocompleteSchema[]> {

		return this.dataTransferService.getData(this.settingsService.autocompleteSchemasServerAddress).then(
			(result: AutocompleteSchema[]) => {
				return result;
			}
		);
	}

	/**
	 * addNewSchema
	 *
	 * Adds new schema to the database
	 */
	 addNewSchema(schema: string, fileName: string, tabName: string, active: boolean): Promise<any> {

		// Check if the schema already has been added (only continue if not)
		return this.checkIfSchemaAlreadyExists(schema).then(
			(exists: boolean) => {

				if (!exists) {

					// Create params string
					let params = {
						'schema': schema,
						'fileName': fileName,
						'tabName': tabName,
						'active': active
					};

					let paramsString = JSON.stringify(params);

					// Create httpOpts (headers)
					let httpOpts = {
						headers: new HttpHeaders().set('Accept', '*/*').set('Content-Type', 'application/json')
					};

					// Send POST-Request
					return this.dataTransferService.postData(this.settingsService.autocompleteSchemasServerAddress, paramsString, httpOpts);

				} else {

					// If there is already a schema show a alert
					this.alertService.showAlert(
						'Add schema',
						'A entry for the schema "' + schema + '" already exists.<br />A duplicate entry is not allowed.'
					);

					return Promise.resolve(null);
				}
			}
		);
	}


	/**
	 * updateAutocompleteSchema
	 *
	 * Updates the saved schema in the database
	 *
	 * @param schemaObj
	 * @param schema
	 */
	 updateAutocompleteSchema(schemaObj: AutocompleteSchema, schema: string, fileName: string, tabName: string, active: boolean): Promise<any> {

		// Create params string
		let params = {
			'id': schemaObj.id,
			'schema': schema,
			'fileName': fileName,
			'tabName': tabName,
			'active': active
		};

		let paramsString = JSON.stringify(params);

		// Create httpOpts (headers)
		let httpOpts = {
			headers: new HttpHeaders().set('Accept', '*/*').set('Content-Type', 'application/json')
		};

		// Check if the schema of new element is the same as before
		if ( schemaObj.schema === schema ) {

			// Send PUT-Request
			return this.dataTransferService.putData(this.settingsService.autocompleteSchemasServerAddress, paramsString, httpOpts);

		} else {

			// Check if the schema already has been added (only continue if not)
			return this.checkIfSchemaAlreadyExists(schema).then(
				(exists: boolean) => {

					if (!exists) {

						// Send PUT-Request
						return this.dataTransferService.putData(this.settingsService.autocompleteSchemasServerAddress, paramsString, httpOpts);

					} else {

						// If there is already a schema show a alert
						this.alertService.showAlert(
							'Update schema',
							'A entry for the schema "' + schema + '" already exists.<br />A duplicate entry is not allowed.'
						);

						return Promise.resolve(null);
					}
				}
			);
		}
	}


	/**
	 * deleteAutocompleteSchema
	 *
	 * Deletes the selected schema in the database
	 *
	 * @param schemaObj
	 */
	deleteAutocompleteSchema(schemaObj: AutocompleteSchema): Promise<any> {

		// Check if there are mappings for the schema
		return this.checkIfSchemaHasMappings(schemaObj.id).then(
			(result: number) => {

				// Only delete if there are no mappings for the schema, else alert the user
				if ( result > 0 ) {

					// If there is already a schema show a alert
					this.alertService.showAlert(
						'Delete schema',
						'The schema "' + schemaObj.schema + '" cannot be deleted.<br />There are ' + result + ' mappings using this schema.'
					);

					return Promise.resolve(null);

				} else {
					return this.dataTransferService.deleteData(this.settingsService.autocompleteSchemasServerAddress + schemaObj.id);
				}
			}
		)
	}


	/**
	 * getAllMappingsBySchemaId
	 *
	 * Gets all mappings to a specific schema from the database
	 *
	 * @param schema
	 * @returns
	 */
	getAllMappingsBySchemaId(schema: string): Promise<AutocompleteMapping[]> {

		return this.dataTransferService.getData(this.settingsService.autocompleteSchemasServerAddress + '/mappings/' + schema).then(
			(mappings: AutocompleteMapping[]) => {
				return mappings;
			}
		);
	}


	/**
	 * checkIfSchemaAlreadyExists
	 *
	 * Checks if a schema already exists
	 *
	 * @param schema
	 * @returns
	 */
	checkIfSchemaAlreadyExists(schema: string): Promise<boolean> {

		return this.getAllSchemas().then(
			(schemas: AutocompleteSchema[]) => {

				// If the value is in one of the datasources -> return true
				if (schemas.some((e: AutocompleteSchema) => e.schema === schema) ) {
					return true;
				}

				return false;
			}
		);
	}


	/**
	 * schemaHasMappings
	 *
	 * Checks if a schema has mappings
	 *
	 * @param schema
	 * @returns
	 */
	checkIfSchemaHasMappings(schema: string): Promise<number> {

		// Get all mappings
		return this.getAllMappingsBySchemaId(schema).then(
			(mappings: AutocompleteMapping[]) => {

				// Check if the count is larger than 0 -> has mappings
				if ( mappings.length > 0 ) {
					return mappings.length;
				}

				// Schema has no mappings
				return 0;
			}
		);
	}


	/**
	 * getSchemaByFileName
	 *
	 * Gets a schema by its file name
	 *
	 * @param fileName
	 * @returns
	 */
	getSchemaByFileName(fileName: string): Promise<AutocompleteSchema> {
		return this.dataTransferService.getData(this.settingsService.autocompleteSchemasServerAddress + '/schema/' + fileName).then(
			(schema: AutocompleteSchema) => {
				return schema;
			}
		);
	}
}

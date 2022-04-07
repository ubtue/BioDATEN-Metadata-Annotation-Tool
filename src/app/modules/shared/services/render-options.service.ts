import { HttpHeaders } from '@angular/common/http';
import { RenderOption } from './../models/render-option.model';
import { AlertService } from './alert.service';
import { DataTransferService } from './../../core/services/data-transfer.service';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class RenderOptionsService {

	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService,
		private dataTransferService: DataTransferService,
		private alertService: AlertService) {}


	/**
	 * getAllRenderOptions
	 *
	 * Gets all the render options from the database
	 *
	 * @returns
	 */
	getAllRenderOptions(): Promise<RenderOption[]> {

		return this.dataTransferService.getData(this.settingsService.renderOptionsServerAddress).then(
			(result: RenderOption[]) => {
				return result;
			}
		);
	}


	/**
	 * getSingleRenderOption
	 *
	 * Gets a specific render option from the database
	 *
	 * @param id
	 * @returns
	 */
	getSingleRenderOption(id: string): Promise<RenderOption> {

		return this.dataTransferService.getData(this.settingsService.renderOptionsServerAddress + id).then(
			(result: RenderOption) => {
				return result;
			}
		)
	}


	/**
	 * addNewRenderOption
	 *
	 * Adds new render option to the database
	 * @param schema
	 * @param xpath
	 * @param placeholder
	 * @param prefilled
	 * @param readonly
	 * @param hide
	 * @param active
	 */
	 addNewRenderOption(schema: string, xpath: string, label: string, placeholder: string, prefilled: string, readonly: boolean, hide: boolean, active: boolean): Promise<any> {

		// Check if the xpath already has been added (only continue if not)
		return this.xpathAlreadyExists(schema, xpath).then(
			(exists: boolean) => {

				if (!exists) {

					// Create params string
					let params = {
						'schema': schema,
						'xpath': xpath,
						'label': label,
						'placeholder': placeholder,
						'prefilled': prefilled,
						'readonly': readonly,
						'hide': hide,
						'active': active
					};

					let paramsString = JSON.stringify(params);

					// Create httpOpts (headers)
					let httpOpts = {
						headers: new HttpHeaders().set('Accept', '*/*').set('Content-Type', 'application/json')
					};

					// Send POST-Request
					return this.dataTransferService.postData(this.settingsService.renderOptionsServerAddress, paramsString, httpOpts);

				} else {

					// If there is already a render option show a alert
					this.alertService.showAlert(
						'Add render option',
						'A render option for the xpath "' + xpath + '" already exists.<br />A duplicate entry is not allowed.'
					);

					return Promise.resolve(null);
				}
			}
		);
	}


	/**
	 * updateRenderOption
	 *
	 * Updates the saved render option in the database
	 *
	 * @param renderOption
	 * @param schema
	 * @param xpath
	 * @param placeholder
	 * @param prefilled
	 * @param readonly
	 * @param hide
	 * @param active
	 */
	updateRenderOption(renderOption: RenderOption, schema: string, xpath: string, label: string, placeholder: string, prefilled: string, readonly: boolean, hide: boolean, active: boolean): Promise<any> {

		// Create params string
		let params = {
			'id': renderOption.id,
			'schema': schema,
			'xpath': xpath,
			'label': label,
			'placeholder': placeholder,
			'prefilled': prefilled,
			'readonly': readonly,
			'hide': hide,
			'active': active
		};

		let paramsString = JSON.stringify(params);

		// Create httpOpts (headers)
		let httpOpts = {
			headers: new HttpHeaders().set('Accept', '*/*').set('Content-Type', 'application/json')
		};

		// Check if the xpath of new element is the same as before
		if ( renderOption.xpath === xpath ) {

			// Send PUT-Request
			return this.dataTransferService.putData(this.settingsService.renderOptionsServerAddress, paramsString, httpOpts);

		} else {

			// Check if the xpath already has been added (only continue if not)
			return this.xpathAlreadyExists(schema, xpath).then(
				(exists: boolean) => {

					if (!exists) {

						// Send PUT-Request
						return this.dataTransferService.putData(this.settingsService.renderOptionsServerAddress, paramsString, httpOpts);

					} else {

						// If there is already a render option show a alert
						this.alertService.showAlert(
							'Update render option',
							'A render option for the xpath "' + xpath + '" already exists.<br />A duplicate entry is not allowed.'
						);

						return Promise.resolve(null);
					}
				}
			);
		}
	}


	/**
	 * deleteRenderOption
	 *
	 * Deletes the selected render option in the database
	 *
	 * @param renderOption
	 */
	deleteRenderOption(renderOption: RenderOption): Promise<any> {

		return this.dataTransferService.deleteData(this.settingsService.renderOptionsServerAddress + renderOption.id).then(
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
	 * Checks if a render option for the given xpath has already been added
	 *
	 * @param xpath
	 * @returns
	 */
	xpathAlreadyExists(schema: string, xpath: string): Promise<boolean> {

		return this.getAllRenderOptions().then(
			(renderOptions: RenderOption[]) => {

				// If the value is in one of the datasources -> return true
				if (renderOptions.some((e: RenderOption) => (e.xpath === xpath && e.schema === schema)) ) {
					return true;
				}

				return false;
			}
		);
	}
}

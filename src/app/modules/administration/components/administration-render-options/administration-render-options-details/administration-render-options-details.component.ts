import { AutocompleteSchema } from './../../../../shared/models/autocomplete-schema.model';
import { UpdateNavigationService } from './../../../../core/services/update-navigation.service';
import { RenderOptionsService } from 'src/app/modules/shared/services/render-options.service';
import { RenderOption } from './../../../../shared/models/render-option.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { AutocompleteSchemaService } from 'src/app/modules/shared/services/autocomplete-schema.service';

@Component({
	selector: 'app-administration-render-options-details',
	templateUrl: './administration-render-options-details.component.html',
	styleUrls: ['./administration-render-options-details.component.scss']
})
export class AdministrationRenderOptionsDetailsComponent implements OnInit, OnDestroy {

	private routeSub: Subscription = new Subscription;

	currentRenderOptionId: string = '';
	currentRenderOption: RenderOption = {} as any;

	schemasData: AutocompleteSchema[] = [];

	readonly INPUT_PREFIX: any = {
		schema: 'input-schema-',
		xpath: 'input-xpath-',
		label: 'input-label-',
		placeholder: 'input-placeholder-',
		prefilled: 'input-prefilled-',
		readonly: 'input-readonly-',
		hide: 'input-hide-',
		active: 'input-active-'
	}

	/**
	 * constructor
	 */
	constructor(private route: ActivatedRoute,
				private renderOptionsService: RenderOptionsService,
				private updateNavigationService: UpdateNavigationService,
				private alertService: AlertService,
				private autocompleteSchemaService: AutocompleteSchemaService) { }


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {

		// Get the route params
		this.routeSub = this.route.params.subscribe(params => {

			// Get the ID
			if ( params['id'] ) {
				this.currentRenderOptionId = params['id'];

				// If there is an ID get the data
				this.renderOptionsService.getSingleRenderOption(this.currentRenderOptionId).then(
					(renderOption: RenderOption) => {
						this.currentRenderOption = renderOption;

						// Change the navigation title
						this.updateNavigationService.updateCurrentView("Administration:", "Render Option for xpath: " + renderOption.xpath);
					}
				);
			}

			// Get all the schemas from the database
			this.autocompleteSchemaService.getAllSchemas().then(
				(schemas: AutocompleteSchema[]) => {
					this.schemasData = schemas;
				}
			);
		});
	}

	/**
	 * ngOnDestroy
	 */
	ngOnDestroy() {

		// Unsubscribe to the route subscription
		this.routeSub.unsubscribe();
	}


	/**
	 * onClickSave
	 *
	 * Onclick hanlder for saving
	 *
	 * @param renderOption
	 */
	onClickSave(renderOption: RenderOption): void {

		// Schema
		let schemaInput = document.getElementById(this.INPUT_PREFIX.schema + renderOption.id) as HTMLSelectElement;
		let schemaValue = schemaInput.value;

		// Xpath
		let xpathInput = document.getElementById(this.INPUT_PREFIX.xpath + renderOption.id) as HTMLInputElement;
		let xpathValue = xpathInput.value;

		// Label
		let labelInput = document.getElementById(this.INPUT_PREFIX.label + renderOption.id) as HTMLInputElement;
		let labelValue = labelInput.value;

		// Placeholder
		let placeholderInput = document.getElementById(this.INPUT_PREFIX.placeholder + renderOption.id) as HTMLInputElement;
		let placeholderValue = placeholderInput.value;

		// Prefilled
		let prefilledInput = document.getElementById(this.INPUT_PREFIX.prefilled + renderOption.id) as HTMLInputElement;
		let prefilledValue = prefilledInput.value;

		// Readonly
		let readonlyInput = document.getElementById(this.INPUT_PREFIX.readonly + renderOption.id) as HTMLInputElement;
		let readonlyValue = readonlyInput.checked;

		// Hide
		let hideInput = document.getElementById(this.INPUT_PREFIX.hide + renderOption.id) as HTMLInputElement;
		let hideValue = hideInput.checked;

		// Active
		let activeInput = document.getElementById(this.INPUT_PREFIX.active + renderOption.id) as HTMLInputElement;
		let activeValue = activeInput.checked;

		// Update the render option in the database
		this.updateRenderOption(renderOption, schemaValue, xpathValue, labelValue, placeholderValue, prefilledValue, readonlyValue, hideValue, activeValue);
	}


	/**
	 * updateRenderOption
	 *
	 * Updates the render option in the database
	 *
	 * @param renderOption
	 * @param schema
	 * @param xpath
	 * @param label
	 * @param placeholder
	 * @param prefilled
	 * @param readonly
	 * @param hide
	 * @param active
	 */
	private updateRenderOption(renderOption: RenderOption, schema: string, xpath: string, label: string, placeholder: string, prefilled: string, readonly: boolean, hide: boolean, active: boolean): void {

		// Check if input is valid
		if ( this.isInputValid(xpath) ) {

			// Update render option in the database
			this.renderOptionsService.updateRenderOption(renderOption, schema, xpath, label, placeholder, prefilled, readonly, hide, active).then(
				(response: RenderOption) => {

					// Show alert that data has been saved
					this.alertService.showAlert(
						'Render option updated',
						'The render option has successfully been updated.'
					);

					// Change the navigation title
					this.updateNavigationService.updateCurrentView("Administration:", "Render Option for xpath: " + response.xpath);
				}
			);
		}
	}


	/**
	 * isInputValid
	 *
	 * Checks if the inputs are valid
	 *
	 * @param schema
	 * @returns
	 */
	private isInputValid(xpath: string): boolean {

		// Check if all inputs have a value
		if ( xpath === '' ) {

			this.alertService.showAlert(
				'Inputs cannot be empty',
				'The values are not valid. Please check if the xpath input has a value.'
			);

			return false;
		}

		return true;
	}
}

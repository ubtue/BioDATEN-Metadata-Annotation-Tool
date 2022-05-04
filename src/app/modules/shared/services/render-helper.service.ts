import { AutocompleteSchemaService } from 'src/app/modules/shared/services/autocomplete-schema.service';
import { AutocompleteSchema } from './../models/autocomplete-schema.model';
import { RenderOption } from './../models/render-option.model';
import { RenderOptionsService } from 'src/app/modules/shared/services/render-options.service';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { Injectable } from '@angular/core';


@Injectable({
	providedIn: 'root',
})
export class RenderHelperService {

	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService,
				private renderOptionsService: RenderOptionsService,
				private autocompleteSchemaService: AutocompleteSchemaService) {}



	/**
	 * applyRenderOptions
	 *
	 * Applys all the render options in the database to the form
	 */
	applyRenderOptions(): void {

		// Load render options
		this.renderOptionsService.getAllRenderOptions().then(
			(renderOptions: RenderOption[]) => {

				// Load all schemas for parsing
				this.autocompleteSchemaService.getAllSchemas().then(
					(schemas: AutocompleteSchema[]) => {

						// Parse the schema names into the render options
						let parsedRenderOptions = this.parseSchemasToRenderOptions(schemas, renderOptions);

						// Loop through all render options and apply them
						for ( let i = 0; i < parsedRenderOptions.length; i++ ) {

							let currentRenderOption: RenderOption = parsedRenderOptions[i];

							// Check if the render option is active
							if ( currentRenderOption.active === true ) {

								// Get elements
								// This could be multiple elements because of min and max occur -> there can be multiple elements added with the add button
								let parentElements = document.querySelectorAll(
									'div[data-tab="' + currentRenderOption.schema + '"] [data-xsd2html2xml-xpath="' + currentRenderOption.xpath + '"]');

								// Apply the different render options
								if ( parentElements.length > 0 ) {

									// Loop through the elements
									for ( let j = 0; j < parentElements.length; j++ ) {

										let parentElement = parentElements[j] as HTMLElement;

										if ( parentElement ) {

											// Type of parent element
											switch ( parentElement.nodeName.toUpperCase() ) {

												case 'FIELDSET':

													// Label
													if ( currentRenderOption.label !== '' ) {
														this.applyLabel(parentElement, currentRenderOption, true);
													}

													// Readonly
													if ( currentRenderOption.readonly === true ) {
														this.applyReadonly(parentElement, currentRenderOption, true);
													}

													// Hide
													if ( currentRenderOption.hide === true ) {
														this.applyHide(parentElement, currentRenderOption, true);
													}

													break;


												// Parent element is of type label
												case 'LABEL':
												default:

													// Label
													if ( currentRenderOption.label !== '' ) {
														this.applyLabel(parentElement, currentRenderOption);
													}

													// Placeholder
													if ( currentRenderOption.placeholder !== '' ) {
														this.applyPlaceholder(parentElement, currentRenderOption);
													}

													// Prefilled value
													if ( currentRenderOption.prefilled !== '' ) {
														this.applyPrefilledValue(parentElement, currentRenderOption);
													}

													// Readonly
													if ( currentRenderOption.readonly === true ) {
														this.applyReadonly(parentElement, currentRenderOption);
													}

													// Hide
													if ( currentRenderOption.hide === true ) {
														this.applyHide(parentElement, currentRenderOption);
													}

													break;
											}
										}
									}
								}
							}
						}
					}
				);
			}
		);
	}


	/**
	 * applyLabel
	 *
	 * Changes the label according to the custom render option
	 *
	 * @param parentElement
	 * @param renderOption
	 * @param isFieldset
	 */
	 applyLabel(parentElement: HTMLElement, renderOption: RenderOption, isFieldset?: boolean): void {

		let labelContainer;

		// Is parent element fieldset or span?
		if ( isFieldset ) {

			labelContainer = parentElement.querySelector(':scope > legend') as HTMLLegendElement;

		} else {

			// Get the span that displays the label
			labelContainer = parentElement.querySelector(':scope > span') as HTMLSpanElement;
		}

		// Change the label
		// Because there is more in the span than the text only the innerText needs to be replaced by the custom label
		if ( labelContainer ) {
			labelContainer.innerHTML = labelContainer.innerHTML.replace(labelContainer.innerText, renderOption.label);
		}
	}


	/**
	 * applyPlaceholder
	 *
	 * Changes the placeholder according to the custom render option
	 *
	 * @param parentElement
	 * @param renderOption
	 */
	applyPlaceholder(parentElement: HTMLElement, renderOption: RenderOption): void {

		// Get the input element
		let inputElement = parentElement.querySelector(':scope > input[type="text"]') as HTMLInputElement;

		// Set the placeholder
		inputElement.setAttribute('placeholder', renderOption.placeholder);
	}


	/**
	 * applyPrefilledValue
	 *
	 * Prefilles a input element with a value according to the custom render option
	 *
	 * @param parentElement
	 * @param renderOption
	 */
	applyPrefilledValue(parentElement: HTMLElement, renderOption: RenderOption): void {

		// Get the input element
		let inputElement = parentElement.querySelector(':scope > input[type="text"]') as HTMLInputElement;

		// Set the value if no other value is set yet
		if ( inputElement.value.trim().length === 0 ) {
			inputElement.value = renderOption.prefilled;
		}
	}


	/**
	 * applyReadonly
	 *
	 * Makes a section readonly according to the custom render option
	 *
	 * @param parentElement
	 * @param renderOption
	 * @param isFieldset
	 */
	applyReadonly(parentElement: HTMLElement, renderOption: RenderOption, isFieldset?: boolean): void {

		// Get the input element
		let inputElement = parentElement.querySelector(':scope > input[type="text"]') as HTMLInputElement;

		// Set the readonly value
		inputElement.readOnly = renderOption.readonly;
	}


	/**
	 * applyHide
	 *
	 * Changes the visibility according to the custom render option
	 *
	 * @param parentElement
	 * @param renderOption
	 * @param isFieldset
	 */
	applyHide(parentElement: HTMLElement, renderOption: RenderOption, isFieldset?: boolean): void {

		// Hide the parent section of the xpath
		let section  = parentElement.closest('section') as HTMLElement;

		if ( typeof section !== 'undefined' && section !== null ) {
			section.style.display = 'none';
		}
	}


	/**
	 * parseSchemasToRenderOptions
	 *
	 * Parses the name of the schema into the render options instead of the id
	 *
	 * @param schemas
	 * @param renderOptions
	 */
	parseSchemasToRenderOptions(schemas: AutocompleteSchema[], renderOptions: RenderOption[]): RenderOption[] {

		let parsedRenderOptions: RenderOption[] = [];

		// Loop through the render options and replace the schema id with the schema name
		for ( let i = 0; i < renderOptions.length; i++ ) {

			let renderOption = renderOptions[i];

			for ( let j = 0; j < schemas.length; j++ ) {

				let schema = schemas[j];

				// If the mapping render option id and the id of the schema match replace the value
				// and leave the inner loop
				if ( renderOption.schema === schema.id ) {
					renderOption.schema = schema.schema;

					parsedRenderOptions.push(renderOption);

					break;
				}
			}
		}

		return parsedRenderOptions;
	}
}

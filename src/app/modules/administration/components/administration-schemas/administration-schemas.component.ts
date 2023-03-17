import { UpdateNavigationService } from 'src/app/modules/core/services/update-navigation.service';
import { AlertButton } from './../../../shared/models/alert-button.model';
import { MatSort, MatSortable } from '@angular/material/sort';
import { AutocompleteSchemaService } from './../../../shared/services/autocomplete-schema.service';
import { AutocompleteSchema } from './../../../shared/models/autocomplete-schema.model';
import { AlertService } from './../../../shared/services/alert.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
	selector: 'app-administration-schemas',
	templateUrl: './administration-schemas.component.html',
	styleUrls: ['./administration-schemas.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AdministrationSchemasComponent implements OnInit, AfterViewInit {

	showId: boolean = false;

	readonly INPUT_PREFIX: any = {
		schema: 'input-schema-',
		fileName: 'input-file-name-',
		tabName: 'input-tab-name-',
		active: 'input-active-'
	}

	dataSource: any = [];

	autocompleteSchemaDataSortedForBlocks: AutocompleteSchema[] = [];

	autocompleteSchemaData: AutocompleteSchema[] = [];

	readonly MAPPING_FIELD_VALUE = {
		id: 'id',
		schema: 'schema',
		fileName: 'fileName',
		tabName: 'tabName',
		active: 'active',
		save: 'save',
		delete: 'delete'
	};

	readonly displayedColumns: string[] = [
		this.MAPPING_FIELD_VALUE.id,
		this.MAPPING_FIELD_VALUE.schema,
		this.MAPPING_FIELD_VALUE.fileName,
		this.MAPPING_FIELD_VALUE.tabName,
		this.MAPPING_FIELD_VALUE.active,
		this.MAPPING_FIELD_VALUE.save,
		this.MAPPING_FIELD_VALUE.delete,
	];

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;


	@ViewChild('addNewInputSchema') addNewInputSchema!: ElementRef;
	@ViewChild('addNewInputFileName') addNewInputFileName!: ElementRef;
	@ViewChild('addNewInputTabName') addNewInputTabName!: ElementRef;
	@ViewChild('addNewInputActive') addNewInputActive!: ElementRef;

	/**
	 * constructor
	 */
	constructor(private alertService: AlertService,
				private autocompleteSchemaService: AutocompleteSchemaService,
				private cdRef: ChangeDetectorRef,
				private updateNavigationService: UpdateNavigationService) { }


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {
		this.updateNavigationService.updateCurrentView("Administration:", "Schemas");
	}


	/**
	 * ngAfterViewInit
	 */
	ngAfterViewInit(): void {

		// Refresh the data source
		this.refreshDataSource(true);
	}


	/**
	 * onClickAddSchemaButton
	 *
	 * Onclick handler for add button in add new schema fieldset
	 */
	onClickAddSchemaButton(): void {
		this.addNewSchema();
	}


	/**
	 * onClickRowSave
	 *
	 * Onclick handler for a table row save
	 *
	 * @param element
	 */
	onClickRowSave(element: AutocompleteSchema): void {

		// Schema
		let schemaInput = document.getElementById(this.INPUT_PREFIX.schema + element.id) as HTMLInputElement;
		let schemaValue = schemaInput.value;

		// File name
		let fileNameInput = document.getElementById(this.INPUT_PREFIX.fileName + element.id) as HTMLInputElement;
		let fileNameValue = fileNameInput.value;

		// Tab name
		let tabNameInput = document.getElementById(this.INPUT_PREFIX.tabName + element.id) as HTMLInputElement;
		let tabNameValue = tabNameInput.value;

		// Active
		let activeInput = document.getElementById(this.INPUT_PREFIX.active + element.id) as HTMLInputElement;
		let activeValue = activeInput.checked;

		// Update the schema in the database
		this.updateAutocompleteSchema(element, schemaValue, fileNameValue, tabNameValue, activeValue);
	}


	/**
	 * onClickRowDelete
	 *
	 * Onclick handler for a table row delete
	 *
	 * @param element
	 */
	onClickRowDelete(element: AutocompleteSchema): void {

		let buttons: AlertButton[] = [];

		// Confirm button
		buttons.push(
			new AlertButton(
				'Confirm',
				() => {
					this.deleteAutocompleteSchema(element);
					this.alertService.hideAlert();
				}
			)
		);

		// Cancel button
		buttons.push(
			new AlertButton(
				'Cancel',
				() => {
					this.alertService.hideAlert();
				}
			)
		);

		// Show alert
		this.alertService.showAlert(
			'Delete schema',
			'Are you sure you want to delete the entry for schema "' + element.schema + '"?',
			buttons
		);
	}


	/**
	 * addNewSchema
	 *
	 * Adds new schema to the database
	 */
	private addNewSchema(): void {

		// Get the values for schema
		let schema = this.addNewInputSchema.nativeElement.value;
		let fileName = this.addNewInputFileName.nativeElement.value;
		let tabName = this.addNewInputTabName.nativeElement.value;
		let active = this.addNewInputActive.nativeElement.checked;

		// Check if input is valid
		if ( this.isInputValid(schema) ) {

			// Add new schema to the database
			this.autocompleteSchemaService.addNewSchema(schema, fileName, tabName, active).then(
				(response: any) => {

					// Update the List if the response is not null
					if ( response !== null ) {
						this.refreshDataSource();
					}
				}
			);
		}
	}


	/**
	 * updateAutocompleteSchema
	 *
	 * Updates the saved schema in the database
	 *
	 * @param schemaObj
	 * @param schema
	 */
	private updateAutocompleteSchema(schemaObj: AutocompleteSchema, schema: string, fileName: string, tabName: string, active: boolean): void {

		// Check if input is valid
		if ( this.isInputValid(schema) ) {

			// Update schema in the database
			this.autocompleteSchemaService.updateAutocompleteSchema(schemaObj, schema, fileName, tabName, active).then(
				(response: any) => {

					// Update the List if the response is not null
					if ( response !== null ) {
						this.refreshDataSource();
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
	private deleteAutocompleteSchema(schemaObj: AutocompleteSchema): void {

		this.autocompleteSchemaService.deleteAutocompleteSchema(schemaObj).then(
			() => {
				this.refreshDataSource();
			}
		);
	}


	/**
	 * refreshDataSource
	 *
	 * Refreshes the data source
	 */
	private refreshDataSource(isFirst?: boolean): Promise<void> {

		// Get all the schemas from the database
		return this.autocompleteSchemaService.getAllSchemas().then(
			(autocompleteSchemas: AutocompleteSchema[]) => {

				if ( autocompleteSchemas.length > 0 ) {

					this.autocompleteSchemaData = autocompleteSchemas;
					this.autocompleteSchemaDataSortedForBlocks = autocompleteSchemas;

					// Put the data in an MatTableDataSource, so it can be sorted
					this.dataSource = new MatTableDataSource(this.autocompleteSchemaData);

					// On first display, activate the sorting.
					// On following displays, only use the sorting
					if ( isFirst ) {

						// Activate the sorting
						this.sort.sort((
							{ id: 'schema', start: 'asc', disableClear: true }
						) as MatSortable);

						this.dataSource.sort = this.sort;

						// Disable clearing the sorting state
						this.dataSource.sort.disableClear = true;

						this.dataSource.paginator = this.paginator;
					} else {
						this.dataSource.sort = this.sort;

						// Disable clearing the sorting state
						this.dataSource.sort.disableClear = true;

						this.dataSource.paginator = this.paginator;
					}

					// Detect the changes manually
					// This needs to be done because Angular will throw an error if the data
					// is manipulated within ngAfterViewInit. Sadly, mat-tables require
					// the population of the sortable content within ngAfterViewInit.
					this.cdRef.detectChanges();
				}
			}
		);
	}


	/**
	 * isInputValid
	 *
	 * Checks if the inputs are valid
	 *
	 * @param schema
	 * @returns
	 */
	private isInputValid(schema: string): boolean {

		// Check if all inputs have a value
		if ( schema === '' ) {

			this.alertService.showAlert(
				'Inputs cannot be empty',
				'The values are not valid. Please check if the schema input has a value.'
			);

			return false;
		}

		return true;
	}
}

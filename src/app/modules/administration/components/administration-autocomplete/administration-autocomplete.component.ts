import { HtmlHelperService } from './../../../shared/services/html-helper.service';
import { AutocompleteSchemaService } from './../../../shared/services/autocomplete-schema.service';
import { AutocompleteSchema } from './../../../shared/models/autocomplete-schema.model';
import { AutocompleteMappingService } from './../../../shared/services/autocomplete-mapping.service';
import { AlertButton } from './../../../shared/models/alert-button.model';
import { AlertService } from './../../../shared/services/alert.service';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { DataTransferService } from './../../../core/services/data-transfer.service';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AutocompleteMapping } from './../../../shared/models/autocomplete-mapping.model';
import { UpdateNavigationService } from 'src/app/modules/core/services/update-navigation.service';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpHeaders } from '@angular/common/http';

@Component({
	selector: 'app-administration-autocomplete',
	templateUrl: './administration-autocomplete.component.html',
	styleUrls: ['./administration-autocomplete.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AdministrationAutocompleteComponent implements OnInit, AfterViewInit {

	showId: boolean = false;

	readonly INPUT_PREFIX: any = {
		schema: 'input-schema-',
		xpath: 'input-xpath-',
		ontology: 'input-ontology-',
		active: 'input-active-'
	}

	activeTabSchema: string = '';

	dataSource: any = [];

	autocompleteMappingDataSortedForBlocks: AutocompleteMapping[] = [];

	autocompleteMappingData: AutocompleteMapping[] = [];

	autocompleteMappingDataAll: AutocompleteMapping[] = [];
	autocompleteMappingDataBySchema: any = {};

	schemasData: AutocompleteSchema[] = [];

	readonly MAPPING_FIELD_VALUE = {
		id: 'id',
		schema: 'schema',
		xpath: 'xpath',
		ontology: 'ontology',
		active: 'active',
		save: 'save',
		delete: 'delete'
	};

	readonly displayedColumns: string[] = [
		this.MAPPING_FIELD_VALUE.id,
		this.MAPPING_FIELD_VALUE.schema,
		this.MAPPING_FIELD_VALUE.xpath,
		this.MAPPING_FIELD_VALUE.ontology,
		this.MAPPING_FIELD_VALUE.active,
		this.MAPPING_FIELD_VALUE.save,
		this.MAPPING_FIELD_VALUE.delete,
	];

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatTable) table!: MatTable<any>;

	@ViewChild('addNewInputSchema') addNewInputSchema!: ElementRef;
	@ViewChild('addNewInputXpath') addNewInputXpath!: ElementRef;
	@ViewChild('addNewInputOntology') addNewInputOntology!: ElementRef;
	@ViewChild('addNewInputActive') addNewInputActive!: ElementRef;

	@ViewChild('tabControl') tabControl!: ElementRef;
	@ViewChild('tabButtonAll') tabButtonAll!: ElementRef;

	/**
	 * constructor
	 */
	constructor(private updateNavigationService: UpdateNavigationService,
		private cdRef: ChangeDetectorRef,
		private dataTransferService: DataTransferService,
		private settingsService: SettingsService,
		private autocompleteMappingService: AutocompleteMappingService,
		private autocompleteSchemaService: AutocompleteSchemaService,
		private alertService: AlertService,
		private htmlHelperService: HtmlHelperService) { }


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {
		this.updateNavigationService.updateCurrentView("Administration:", "Autocomplete Mappings");
	}


	/**
	 * ngAfterViewInit
	 */
	ngAfterViewInit(): void {

		// Refresh the data source
		this.refreshDataSource(true);

		// Get all the schemas from the database
		this.autocompleteSchemaService.getAllSchemas().then(
			(schemas: AutocompleteSchema[]) => {
				this.schemasData = schemas;

				// Init tab control
				this.initTabs();

				// Select the first option with a timeout
				let select = this.addNewInputSchema.nativeElement as HTMLSelectElement;

				this.htmlHelperService.selectOptionWithTimeout(select, 0, 25);
			}
		);
	}


	/**
	 * onClickRowSave
	 *
	 * Onclick handler for a table row save
	 *
	 * @param element
	 */
	onClickRowSave(element: AutocompleteMapping): void {

		// Schema
		let schemaInput = document.getElementById(this.INPUT_PREFIX.schema + element.id) as HTMLSelectElement;
		let schemaValue = schemaInput.value;

		// Xpath
		let xpathInput = document.getElementById(this.INPUT_PREFIX.xpath + element.id) as HTMLInputElement;
		let xpathValue = xpathInput.value;

		// Ontology
		let ontologyInput = document.getElementById(this.INPUT_PREFIX.ontology + element.id) as HTMLInputElement;
		let ontologyValue = ontologyInput.value;

		// Active
		let activeInput = document.getElementById(this.INPUT_PREFIX.active + element.id) as HTMLInputElement;
		let activeValue = activeInput.checked;

		// Update the mapping in the database
		this.updateAutocompleteMapping(element, schemaValue, xpathValue, ontologyValue, activeValue);
	}


	/**
	 * onClickRowDelete
	 *
	 * Onclick handler for a table row delete
	 *
	 * @param element
	 */
	onClickRowDelete(element: AutocompleteMapping): void {

		let buttons: AlertButton[] = [];

		// Confirm button
		buttons.push(
			new AlertButton(
				'Confirm',
				() => {
					this.deleteAutocompleteMapping(element);
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
			'Delete mapping',
			'Are you sure you want to delete the mapping for xpath "' + element.xpath + '"?',
			buttons
		);
	}


	/**
	 * onClickAddMappingButton
	 *
	 * Onclick handler for add button in add new mapping fieldset
	 */
	onClickAddMappingButton(): void {
		this.addNewMapping();
	}


	/**
	 * onClickTabButtonAll
	 *
	 * Onclick handler for the tab button 'all'
	 */
	onClickTabButtonAll(): void {

		// Display the full data
		this.displayData(this.autocompleteMappingDataAll);

		// Activate the all button
		this.setActiveTab(this.tabButtonAll.nativeElement)
	}


	/**
	 * addNewMapping
	 *
	 * Adds new mapping to the database
	 */
	private addNewMapping(): void {

		// Get the values for xpath and ontology
		let schema = this.addNewInputSchema.nativeElement.value;
		let xpath = this.addNewInputXpath.nativeElement.value;
		let ontology = this.addNewInputOntology.nativeElement.value;
		let active = this.addNewInputActive.nativeElement.checked;

		// Check if input is valid
		if ( this.isInputValid(xpath, ontology) ) {

			// Add new mapping to the database
			this.autocompleteMappingService.addNewMapping(schema, xpath, ontology, active).then(
				(response: any) => {

					// Update the List if the response is not null
					if ( response !== null ) {
						this.refreshDataSource(false, this.activeTabSchema);
					}
				}
			);
		}
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
	private updateAutocompleteMapping(mapping: AutocompleteMapping, schema: string, xpath: string, ontology: string, active: boolean): void {

		// Check if input is valid
		if ( this.isInputValid(xpath, ontology) ) {

			// Update Mapping in the database
			this.autocompleteMappingService.updateAutocompleteMapping(mapping, schema, xpath, ontology, active).then(
				(response: any) => {

					// Update the List if the response is not null
					if ( response !== null ) {
						this.refreshDataSource(false, this.activeTabSchema);
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
	private deleteAutocompleteMapping(mapping: AutocompleteMapping): void {

		this.autocompleteMappingService.deleteAutocompleteMapping(mapping).then(
			() => {
				this.refreshDataSource(false, this.activeTabSchema);
			}
		);
	}


	/**
	 * displayData
	 *
	 * Handles the display of the data
	 *
	 * @param autocompleteMappings
	 * @param isFirst
	 */
	public displayData(autocompleteMappings: AutocompleteMapping[], isFirst?: boolean): void {

		// Put the whole data to display (all tab)
		this.autocompleteMappingData = autocompleteMappings;
		this.autocompleteMappingDataSortedForBlocks = autocompleteMappings;

		// Put the data in an MatTableDataSource, so it can be sorted
		this.dataSource = new MatTableDataSource(this.autocompleteMappingData);

		// On first display, activate the sorting.
		// On following displays, only use the sorting
		if ( isFirst ) {

			// Activate the sorting
			this.sort.sort((
				{ id: 'schema', start: 'asc', disableClear: true  }
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


	/**
	 * refreshDataSource
	 *
	 * Refreshes the data source
	 *
	 * @param isFirst
	 * @param displaySchema
	 */
	private refreshDataSource(isFirst?: boolean, displaySchema?: string): Promise<void> {

		// Get all the mappings from the database
		return this.autocompleteMappingService.getAllMappings().then(
			(autocompleteMappings: AutocompleteMapping[]) => {

				if ( autocompleteMappings.length > 0 ) {

					// Clear the data of the caches
					this.autocompleteMappingDataBySchema = [];
					this.autocompleteMappingDataAll = [];

					// Loop through the data and cache the data by schema
					for ( let i = 0; i < autocompleteMappings.length; i++ ) {

						if ( typeof this.autocompleteMappingDataBySchema[autocompleteMappings[i].schema] === 'undefined' ) {
							this.autocompleteMappingDataBySchema[autocompleteMappings[i].schema] = [] as AutocompleteMapping[];
						}

						this.autocompleteMappingDataBySchema[autocompleteMappings[i].schema].push(autocompleteMappings[i]);
					}

					// Cache data for all schemas
					this.autocompleteMappingDataAll = autocompleteMappings;

					// Force a schema?
					if ( typeof displaySchema !== 'undefined' && displaySchema !== '' ) {

						// Check if there is data for the mapping
						if ( typeof this.autocompleteMappingDataBySchema[displaySchema] !== 'undefined' &&
							 this.autocompleteMappingDataBySchema[displaySchema].length > 0 ) {
							autocompleteMappings = this.autocompleteMappingDataBySchema[displaySchema];
						} else {

							// If there is no data available, set the first tab to be active
							this.onClickTabButtonAll();
						}
					}

					// Handle display
					this.displayData(autocompleteMappings, isFirst);
				} else {

					// If there is no data (e.g. if only item was deleted) -> empty table
					this.displayData([]);
				}
			}
		);
	}


	/**
	 * isInputValid
	 *
	 * Checks if the inputs are valid
	 *
	 * @param xpath
	 * @param ontology
	 * @returns
	 */
	private isInputValid(xpath: string, ontology: string): boolean {

		// Check if all inputs have a value
		if ( xpath === '' || ontology === '' ) {

			this.alertService.showAlert(
				'Inputs cannot be empty',
				'The values are not valid. Please check if both xpath and vocabulary input have a value.'
			);

			return false;
		}

		return true;
	}


	/**
	 * initTabs
	 *
	 * Initializes the tab control
	 */
	private initTabs(): void {

		// Loop through all the schemas and create a tab button for each schema
		for ( let i = 0; i < this.schemasData.length; i++ ) {

			// Create button
			this.createTabButton(this.schemasData[i]);
		}
	}


	/**
	 * createTabButton
	 *
	 * Adds a button to the tab control
	 *
	 * @param schema
	 */
	private createTabButton(schema: AutocompleteSchema): void {

		// Create element
		let tabButton = document.createElement('button') as HTMLButtonElement;

		// Add classes
		tabButton.classList.add('administration-autocomplete-tab');

		// Add schema id as data attribute
		tabButton.setAttribute('data-tab', schema.id);

		// Set text
		tabButton.innerHTML = '<span class="administration-autocomplete-tab-text">' + schema.schema + '</span>';

		// Add event listener for the click -> display data from schema only
		tabButton.addEventListener('click', () => {
			this.displayData(this.autocompleteMappingDataBySchema[schema.id]);
			this.setActiveTab(tabButton);
		});

		// Add button to tab control
		this.tabControl.nativeElement.append(tabButton);
	}


	/**
	 * setActiveTab
	 *
	 * Handles the active status of the tab buttons
	 *
	 * @param button
	 */
	private setActiveTab(button: HTMLButtonElement): void {

		// Remove the active class from all buttons
		this.tabControl.nativeElement.querySelectorAll('button').forEach((element: HTMLButtonElement) => {
			element.classList.remove('active');
		});

		// Add the active class to the pressed button
		button.classList.add('active');

		this.activeTabSchema = button.getAttribute('data-tab') as string;
	}
}

import { Router, ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { AlertButton } from './../../../shared/models/alert-button.model';
import { AutocompleteSchemaService } from './../../../shared/services/autocomplete-schema.service';
import { AutocompleteSchema } from './../../../shared/models/autocomplete-schema.model';
import { RenderOption } from './../../../shared/models/render-option.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { AlertService } from './../../../shared/services/alert.service';
import { UpdateNavigationService } from 'src/app/modules/core/services/update-navigation.service';
import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { RenderOptionsService } from 'src/app/modules/shared/services/render-options.service';
import { HtmlHelperService } from 'src/app/modules/shared/services/html-helper.service';

@Component({
	selector: 'app-administration-render-options',
	templateUrl: './administration-render-options.component.html',
	styleUrls: ['./administration-render-options.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AdministrationRenderOptionsComponent implements OnInit, AfterViewInit {

	showId: boolean = false;

	activeTabSchema: string = '';

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

	dataSource: any = [];

	renderOptionsDataSortedForBlocks: RenderOption[] = [];

	renderOptionsData: RenderOption[] = [];

	renderOptionsDataAll: RenderOption[] = [];
	renderOptionsDataBySchema: any = [];

	readonly MAPPING_FIELD_VALUE = {
		id: 'id',
		schema: 'schema',
		xpath: 'xpath',
		label: 'label',
		placeholder: 'placeholder',
		prefilled: 'prefilled',
		readonly: 'readonly',
		hide: 'hide',
		active: 'active',
		save: 'save',
		delete: 'delete',
		edit: 'edit'
	};

	readonly displayedColumnsStandardView: string[] = [
		this.MAPPING_FIELD_VALUE.id,
		this.MAPPING_FIELD_VALUE.schema,
		this.MAPPING_FIELD_VALUE.xpath,
		this.MAPPING_FIELD_VALUE.label,
		this.MAPPING_FIELD_VALUE.placeholder,
		this.MAPPING_FIELD_VALUE.prefilled,
		this.MAPPING_FIELD_VALUE.readonly,
		this.MAPPING_FIELD_VALUE.hide,
		this.MAPPING_FIELD_VALUE.active,
		this.MAPPING_FIELD_VALUE.save,
		this.MAPPING_FIELD_VALUE.delete,
	];

	readonly displayedColumnsDetailView: string[] = [
		this.MAPPING_FIELD_VALUE.id,
		this.MAPPING_FIELD_VALUE.schema,
		this.MAPPING_FIELD_VALUE.xpath,
		this.MAPPING_FIELD_VALUE.active,
		this.MAPPING_FIELD_VALUE.edit,
		this.MAPPING_FIELD_VALUE.delete,
	];

	displayedColumns: string[] = this.displayedColumnsStandardView;

	detailViewMode: boolean = false;

	hideAddNewFieldset: boolean = true;

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	@ViewChild('addNewInputSchema') addNewInputSchema!: ElementRef;
	@ViewChild('addNewInputXpath') addNewInputXpath!: ElementRef;
	@ViewChild('addNewInputLabel') addNewInputLabel!: ElementRef;
	@ViewChild('addNewInputPlaceholder') addNewInputPlaceholder!: ElementRef;
	@ViewChild('addNewInputPrefilled') addNewInputPrefilled!: ElementRef;
	@ViewChild('addNewInputReadonly') addNewInputReadonly!: ElementRef;
	@ViewChild('addNewInputHide') addNewInputHide!: ElementRef;
	@ViewChild('addNewInputActive') addNewInputActive!: ElementRef;

	@ViewChild('tabControl') tabControl!: ElementRef;
	@ViewChild('tabButtonAll') tabButtonAll!: ElementRef;

	/**
	 * constructor
	 */
	constructor(private renderOptionsService: RenderOptionsService,
				private updateNavigationService: UpdateNavigationService,
				private alertService: AlertService,
				private cdRef: ChangeDetectorRef,
				private autocompleteSchemaService: AutocompleteSchemaService,
				private htmlHelperService: HtmlHelperService,
				private settingsService: SettingsService,
				private router: Router,
				private activatedRoute: ActivatedRoute) { }


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {
		this.updateNavigationService.updateCurrentView("Administration:", "Render Options");

		// Displayed columns in detail view mode?
		if ( this.settingsService.renderOptionsDetailView ) {

			// Set flag
			this.detailViewMode = true;

			// Set the displayed columns
			this.displayedColumns = this.displayedColumnsDetailView;
		}
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
	 * onClickAddRenderOptionButton
	 *
	 * Click handler for the add new render option button
	 */
	onClickAddRenderOptionButton(): void {
		this.addNewRenderOption();
	}


	/**
	 * onChangeActive
	 *
	 * Handles the change of the active checkbox
	 *
	 * @param renderOption
	 */
	onChangeActive(renderOption: RenderOption): void {

		// Get the active value
		let activeInput = document.getElementById(this.INPUT_PREFIX.active + renderOption.id) as HTMLInputElement;
		let activeValue = activeInput.checked;

		// Update the option
		this.updateRenderOption(
			renderOption,
			renderOption.schema,
			renderOption.xpath,
			renderOption.label,
			renderOption.placeholder,
			renderOption.prefilled,
			renderOption.readonly,
			renderOption.hide,
			activeValue
		);
	}


	/**
	 * onClickRowSave
	 *
	 * Onclick hanlder for saving the row
	 *
	 * @param renderOption
	 */
	onClickRowSave(renderOption: RenderOption): void {

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
	 * onClickRowSave
	 *
	 * Onclick hanlder for deleting the row
	 *
	 * @param renderOption
	 */
	onClickRowDelete(renderOption: RenderOption): void {

		let buttons: AlertButton[] = [];

		// Confirm button
		buttons.push(
			new AlertButton(
				'Confirm',
				() => {
					this.deleteRenderOption(renderOption);
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
			'Delete render option',
			'Are you sure you want to delete the render option for xpath "' + renderOption.xpath + '"?',
			buttons
		);
	}


	/**
	 * onClickRowEdit
	 *
	 * On click handler for edit row button
	 *
	 * @param renderOption
	 */
	onClickRowEdit(renderOption: RenderOption): void {

		// Redirect to the detail view
		this.router.navigate(['./details', renderOption.id], {relativeTo: this.activatedRoute});
	}


	/**
	 * onClickTabButtonAll
	 *
	 * Onclick handler for the tab button 'all'
	 */
	onClickTabButtonAll(): void {

		// Display the full data
		this.displayData(this.renderOptionsDataAll);

		// Activate the all button
		this.setActiveTab(this.tabButtonAll.nativeElement)
	}


	/**
	 * onClickToggleAddNewFieldset
	 *
	 * Onclick handler for the button to toggle the fieldset for adding a new render option
	 */
	onClickToggleAddNewFieldset(): void {
		this.hideAddNewFieldset = !this.hideAddNewFieldset;
	}


	/**
	 * addNewRenderOption
	 *
	 * Adds new render option to the database
	 */
	private addNewRenderOption(): void {

		// Get the values
		let schema = this.addNewInputSchema.nativeElement.value;
		let xpath = this.addNewInputXpath.nativeElement.value;
		let label = this.addNewInputLabel.nativeElement.value;
		let placeholder = this.addNewInputPlaceholder.nativeElement.value;
		let prefilled = this.addNewInputPrefilled.nativeElement.value;
		let readonly = this.addNewInputReadonly.nativeElement.checked;
		let hide = this.addNewInputHide.nativeElement.checked;
		let active = this.addNewInputActive.nativeElement.checked;

		// Check if input is valid
		if ( this.isInputValid(xpath) ) {

			// Add new render option to the database
			this.renderOptionsService.addNewRenderOption(schema, xpath, label, placeholder, prefilled, readonly, hide, active).then(
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
	 * updateRenderOption
	 *
	 * Updates the saved render option in the database
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
	 * deleteRenderOption
	 *
	 * Deletes the selected render option in the database
	 *
	 * @param renderOption
	 */
	private deleteRenderOption(renderOption: RenderOption): void {

		this.renderOptionsService.deleteRenderOption(renderOption).then(
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
	 * @param renderOptions
	 * @param isFirst
	 */
	public displayData(renderOptions: RenderOption[], isFirst?: boolean): void {

		// Put the whole data to display (all tab)
		this.renderOptionsData = renderOptions;
		this.renderOptionsDataSortedForBlocks = renderOptions;

		// Put the data in an MatTableDataSource, so it can be sorted
		this.dataSource = new MatTableDataSource(this.renderOptionsData);

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
	 */
	private refreshDataSource(isFirst?: boolean, displaySchema?: string): Promise<void> {

		// Get all the render options from the database
		return this.renderOptionsService.getAllRenderOptions().then(
			(renderOptions: RenderOption[]) => {

				if ( renderOptions.length > 0 ) {

					// Clear the data of the caches
					this.renderOptionsDataBySchema = [];
					this.renderOptionsDataAll = [];

					// Loop through the data and cache the data by schema
					for ( let i = 0; i < renderOptions.length; i++ ) {

						if ( typeof this.renderOptionsDataBySchema[renderOptions[i].schema] === 'undefined' ) {
							this.renderOptionsDataBySchema[renderOptions[i].schema] = [] as RenderOption[];
						}

						this.renderOptionsDataBySchema[renderOptions[i].schema].push(renderOptions[i]);
					}

					// Cache data for all schemas
					this.renderOptionsDataAll = renderOptions;

					// Force a schema?
					if ( typeof displaySchema !== 'undefined' && displaySchema !== '' ) {

						// Check if there is data for the render option
						if ( typeof this.renderOptionsDataBySchema[displaySchema] !== 'undefined' &&
							 this.renderOptionsDataBySchema[displaySchema].length > 0 ) {
								renderOptions = this.renderOptionsDataBySchema[displaySchema];
						} else {

							// If there is no data available, set the first tab to be active
							this.onClickTabButtonAll();
						}
					}

					// Handle display
					this.displayData(renderOptions, isFirst);
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
		tabButton.classList.add('administration-render-options-tab');

		// Add schema id as data attribute
		tabButton.setAttribute('data-tab', schema.id);

		// Set text
		tabButton.innerHTML = '<span class="administration-render-options-tab-text">' + schema.schema + '</span>';

		// Add event listener for the click -> display data from schema only
		tabButton.addEventListener('click', () => {
			this.displayData(this.renderOptionsDataBySchema[schema.id]);
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

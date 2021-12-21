import { AutocompleteMappingService } from './../../../shared/services/autocomplete-mapping.service';
import { AlertButton } from './../../../shared/models/alert-button.model';
import { AlertService } from './../../../shared/services/alert.service';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { DataTransferService } from './../../../core/services/data-transfer.service';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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

	readonly INPUT_PREFIX: any = {
		xpath: 'input-xpath-',
		ontology: 'input-ontology-',
	}

	dataSource: any = [];

	autocompleteMappingDataSortedForBlocks: AutocompleteMapping[] = [];

	autocompleteMappingData: AutocompleteMapping[] = [];

	readonly MAPPING_FIELD_VALUE = {
		id: 'id',
		xpath: 'xpath',
		ontology: 'ontology',
		save: 'save',
		delete: 'delete'
	};

	readonly displayedColumns: string[] = [
		this.MAPPING_FIELD_VALUE.id,
		this.MAPPING_FIELD_VALUE.xpath,
		this.MAPPING_FIELD_VALUE.ontology,
		this.MAPPING_FIELD_VALUE.save,
		this.MAPPING_FIELD_VALUE.delete,
	];

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	@ViewChild('addNewInputXpath') addNewInputXpath!: ElementRef;
	@ViewChild('addNewInputOntology') addNewInputOntology!: ElementRef;

	/**
	 * constructor
	 */
	constructor(private updateNavigationService: UpdateNavigationService,
		private cdRef: ChangeDetectorRef,
		private dataTransferService: DataTransferService,
		private settingsService: SettingsService,
		private autocompleteMappingService: AutocompleteMappingService,
		private alertService: AlertService) { }


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


		// this.autocompleteMappingData = [
		// 	{ id: '11', xpath: '/', ontology: 'test.json'},
		// 	{ id: '22', xpath: '/test', ontology: 'test2.json'},
		// 	{ id: '33', xpath: '/test/test', ontology: 'test3.json'},
		// ];

		// Refresh the data source
		this.refreshDataSource(true);
	}


	/**
	 * onClickRowSave
	 *
	 * Onclick handler for a table row save
	 *
	 * @param element
	 */
	onClickRowSave(element: AutocompleteMapping): void {

		// Xpath
		let xpathInput = document.getElementById(this.INPUT_PREFIX.xpath + element.id) as HTMLInputElement;
		let xpathValue = xpathInput.value;

		// Ontology
		let ontologyInput = document.getElementById(this.INPUT_PREFIX.ontology + element.id) as HTMLInputElement;
		let ontologyValue = ontologyInput.value;

		// Update the mapping in the database
		this.updateAutocompleteMapping(element, xpathValue, ontologyValue);
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
	 * addNewMapping
	 *
	 * Adds new mapping to the database
	 */
	private addNewMapping(): void {

		// Get the values for xpath and ontology
		let xpath = this.addNewInputXpath.nativeElement.value;
		let ontology = this.addNewInputOntology.nativeElement.value;

		// Check if input is valid
		if ( this.isInputValid(xpath, ontology) ) {

			// Add new mapping to the database
			this.autocompleteMappingService.addNewMapping(xpath, ontology).then(
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
	 * updateAutocompleteMapping
	 *
	 * Updates the saved ontology in the database
	 *
	 * @param mapping
	 * @param xpath
	 * @param ontology
	 */
	private updateAutocompleteMapping(mapping: AutocompleteMapping, xpath: string, ontology: string): void {

		// Check if input is valid
		if ( this.isInputValid(xpath, ontology) ) {

			// Update Mapping in the database
			this.autocompleteMappingService.updateAutocompleteMapping(mapping, xpath, ontology).then(
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
	 * deleteAutocompleteMapping
	 *
	 * Deletes the selected mapping in the database
	 *
	 * @param mapping
	 */
	private deleteAutocompleteMapping(mapping: AutocompleteMapping): void {

		this.autocompleteMappingService.deleteAutocompleteMapping(mapping).then(
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

		// Get all the mappings from the database
		return this.autocompleteMappingService.getAllMappings().then(
			(autocompleteMappings: AutocompleteMapping[]) => {

				this.autocompleteMappingData = autocompleteMappings;
				this.autocompleteMappingDataSortedForBlocks = autocompleteMappings;

				// Put the data in an MatTableDataSource, so it can be sorted
				this.dataSource = new MatTableDataSource(this.autocompleteMappingData);

				if ( isFirst ) {
					// Activate the sorting
					this.sort.sort((
						{ id: 'id', start: 'asc' }
					) as MatSortable);

					this.dataSource.sort = this.sort;

					this.dataSource.paginator = this.paginator;
				}

				// Detect the changes manually
				// This needs to be done because Angular will throw an error if the data
				// is manipulated within ngAfterViewInit. Sadly, mat-tables require
				// the population of the sortable content within ngAfterViewInit.
				this.cdRef.detectChanges();

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
				'The values are not valid. Please check if both xpath and ontology input have a value.'
			);

			return false;
		}

		return true;
	}
}

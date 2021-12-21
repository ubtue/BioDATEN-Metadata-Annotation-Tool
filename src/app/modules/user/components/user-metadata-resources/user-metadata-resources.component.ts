import { MetadataUserResourceBlockSortableField } from './../../../shared/models/metadata-user-resource-block-sortable-field.model';
import { HelperService } from './../../../shared/services/helper.service';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { UpdateNavigationService } from 'src/app/modules/core/services/update-navigation.service';
import { Router } from '@angular/router';
import { MetadataUserResource } from './../../../shared/models/metadata-user-resource.model';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { KeycloakService } from 'src/app/modules/core/services/keycloak.service';


@Component({
	selector: 'app-user-metadata-resources',
	templateUrl: './user-metadata-resources.component.html',
	styleUrls: ['./user-metadata-resources.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UserMetadataResourcesComponent implements OnInit, AfterViewInit {

	readonly RESOURCE_DATA_STATUS = {
		new: {
			label: "New",
			key: "a_new"
		},
		progress: {
			label: "In progress",
			key: "k_progress"
		},
		finished: {
			label: "Finished",
			key: "z_finished"
		}
	};

	readonly RESOURCE_FIELD_VALUES = {
		position: 'position',
		id: 'id',
		title: 'title',
		lastChange: 'lastChange',
		status: 'status',
		statusKey: 'statusKey'
	};

	readonly RESOURCE_FIELD_LABELS = {
		position: 'Position',
		id: 'ID',
		title: 'Title',
		lastChange: 'Last change',
		status: 'Status',
		statusKey: ''
	};

	readonly SORT_METHODS = {
		asc: {
			label: ' (Ascending)',
			key: '_asc'
		},
		desc: {
			label: ' (Descending)',
			key: '_desc'
		}
	};

	userResourceData: MetadataUserResource[] = [];

	userResourceDataSortedForBlocks: MetadataUserResource[] = [];

	sortableUserResourceData: any = [];

	readonly displayedColumns: string[] = [
		this.RESOURCE_FIELD_VALUES.position,
		this.RESOURCE_FIELD_VALUES.id,
		this.RESOURCE_FIELD_VALUES.title,
		this.RESOURCE_FIELD_VALUES.lastChange,
		this.RESOURCE_FIELD_VALUES.status
	];

	dataSource: any = [];

	readonly blockSortableFields: MetadataUserResourceBlockSortableField[] = [
		{
			label: this.RESOURCE_FIELD_LABELS.position + this.SORT_METHODS.asc.label,
			value: this.RESOURCE_FIELD_VALUES.position + this.SORT_METHODS.asc.key
		},
		{
			label: this.RESOURCE_FIELD_LABELS.position + this.SORT_METHODS.desc.label,
			value: this.RESOURCE_FIELD_VALUES.position + this.SORT_METHODS.desc.key
		},
		{
			label: this.RESOURCE_FIELD_LABELS.id + this.SORT_METHODS.asc.label,
			value: this.RESOURCE_FIELD_VALUES.id + this.SORT_METHODS.asc.key
		},
		{
			label: this.RESOURCE_FIELD_LABELS.id + this.SORT_METHODS.desc.label,
			value: this.RESOURCE_FIELD_VALUES.id + this.SORT_METHODS.desc.key
		},
		{
			label: this.RESOURCE_FIELD_LABELS.title + this.SORT_METHODS.asc.label,
			value: this.RESOURCE_FIELD_VALUES.title + this.SORT_METHODS.asc.key
		},
		{
			label: this.RESOURCE_FIELD_LABELS.title + this.SORT_METHODS.desc.label,
			value: this.RESOURCE_FIELD_VALUES.title + this.SORT_METHODS.desc.key
		},
		{
			label: this.RESOURCE_FIELD_LABELS.lastChange + this.SORT_METHODS.asc.label,
			value: this.RESOURCE_FIELD_VALUES.lastChange + this.SORT_METHODS.asc.key
		},
		{
			label: this.RESOURCE_FIELD_LABELS.lastChange + this.SORT_METHODS.desc.label,
			value: this.RESOURCE_FIELD_VALUES.lastChange + this.SORT_METHODS.desc.key
		},
		{
			label: this.RESOURCE_FIELD_LABELS.status + this.SORT_METHODS.asc.label,
			value: this.RESOURCE_FIELD_VALUES.statusKey + this.SORT_METHODS.asc.key
		},
		{
			label: this.RESOURCE_FIELD_LABELS.status + this.SORT_METHODS.desc.label,
			value: this.RESOURCE_FIELD_VALUES.statusKey  + this.SORT_METHODS.desc.key
		}
	];

	selectedBlockSortableField: string = '';

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	/**
	 * constructor
	 */
	constructor(private router: Router,
				private cdRef: ChangeDetectorRef,
				private updateNavigationService: UpdateNavigationService,
				private keycloakService: KeycloakService,
				private settingsService: SettingsService,
				private helperService: HelperService) {

					// Get the default sorting field
					this.selectedBlockSortableField =
						this.settingsService.defaultUserResourceSortingField + '_' + this.settingsService.defaultUserResourceSortingMethod;
				}


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {
		this.updateNavigationService.updateCurrentView("Metadata resources", "");
	}


	/**
	 * ngAfterViewInit
	 */
	ngAfterViewInit() {

		// Get the data that is used for the table
		this.userResourceData = [
			{ position: 1, id: "34232-234245-88964", title: "Research 1", lastChange: "2021-10-18", status: this.RESOURCE_DATA_STATUS.new.label, statusKey: this.RESOURCE_DATA_STATUS.new.key},
			{ position: 2, id: "13353-564547-23453", title: "Research 2", lastChange: "2021-10-17", status: this.RESOURCE_DATA_STATUS.new.label, statusKey: this.RESOURCE_DATA_STATUS.new.key},
			{ position: 3, id: "63564-287434-25332", title: "Research 3", lastChange: "2021-08-21", status: this.RESOURCE_DATA_STATUS.finished.label, statusKey: this.RESOURCE_DATA_STATUS.finished.key},
			{ position: 4, id: "18744-564345-63563", title: "Research 4", lastChange: "2021-10-11", status: this.RESOURCE_DATA_STATUS.progress.label, statusKey: this.RESOURCE_DATA_STATUS.progress.key},
			{ position: 5, id: "45542-457842-32452", title: "Research 5", lastChange: "2021-10-14", status: this.RESOURCE_DATA_STATUS.progress.label, statusKey: this.RESOURCE_DATA_STATUS.progress.key},
			{ position: 6, id: "74562-953453-94342", title: "Research 6", lastChange: "2021-09-28", status: this.RESOURCE_DATA_STATUS.progress.label, statusKey: this.RESOURCE_DATA_STATUS.progress.key},
			{ position: 7, id: "98653-643542-24535", title: "Research 7", lastChange: "2021-06-30", status: this.RESOURCE_DATA_STATUS.finished.label, statusKey: this.RESOURCE_DATA_STATUS.finished.key},
			{ position: 8, id: "73422-876345-86742", title: "Research 8", lastChange: "2021-07-10", status: this.RESOURCE_DATA_STATUS.finished.label, statusKey: this.RESOURCE_DATA_STATUS.finished.key},
			{ position: 9, id: "78764-654221-76452", title: "Research 9", lastChange: "2021-08-20", status: this.RESOURCE_DATA_STATUS.progress.label, statusKey: this.RESOURCE_DATA_STATUS.progress.key},
			{ position: 10, id: "05645-057643-25255", title: "Research 10", lastChange: "2021-06-20", status: this.RESOURCE_DATA_STATUS.finished.label, statusKey: this.RESOURCE_DATA_STATUS.finished.key},
			{ position: 11, id: "26322-764321-36311", title: "Research 11", lastChange: "2020-12-11", status: this.RESOURCE_DATA_STATUS.finished.label, statusKey: this.RESOURCE_DATA_STATUS.finished.key},
			{ position: 12, id: "13533-555421-13542", title: "Research 12", lastChange: "2021-04-10", status: this.RESOURCE_DATA_STATUS.finished.label, statusKey: this.RESOURCE_DATA_STATUS.finished.key},
			{ position: 13, id: "34221-563225-74243", title: "Research 13", lastChange: "2021-06-19", status: this.RESOURCE_DATA_STATUS.finished.label, statusKey: this.RESOURCE_DATA_STATUS.finished.key},
		];

		// Put the data in an MatTableDataSource, so it can be sorted
		this.dataSource = new MatTableDataSource(this.userResourceData);

		// Activate the sorting
		this.sort.sort((
			{ id: this.settingsService.defaultUserResourceSortingField, start: this.settingsService.defaultUserResourceSortingMethod}
		) as MatSortable);
		this.dataSource.sort = this.sort;

		this.dataSource.paginator = this.paginator;

		// Sort the blocks (smaller devices)
		this.userResourceDataSortedForBlocks = this.userResourceData;
		this.sortBlocks();

		// Detect the changes manually
		// This needs to be done because Angular will throw an error if the data
		// is manipulated within ngAfterViewInit. Sadly, mat-tables require
		// the population of the sortable content within ngAfterViewInit.
		this.cdRef.detectChanges();


	}


	/**
	 * onClickTableRow
	 *
	 * Onclick handler for a table row
	 *
	 * @param row
	 */
	onClickTableRow(row: MetadataUserResource): void {

		// Redirects the user to the xml-input view with the selected resource ID as a
		// GET param
		this.router.navigate(["annotation/test-xml-input"], { queryParams: {id: row.id}});
	}


	onBlockSortSelectChange(): void {
		this.sortBlocks();
	}

	/**
	 * sortBlocks
	 *
	 * Sorts the block from the block view
	 */
	sortBlocks(): void {

		if ( this.settingsService.enableConsoleLogs ) {
			console.log('Sorting by: ')
			console.log(this.selectedBlockSortableField );
		}

		// Use different methods for different fields
		switch ( this.selectedBlockSortableField ) {

			// Position: Sort numbers ASC
			case this.RESOURCE_FIELD_VALUES.position + this.SORT_METHODS.asc.key:
				this.userResourceDataSortedForBlocks = this.helperService.sortNumbers(this.RESOURCE_FIELD_VALUES.position, this.userResourceData);
				break;

			// Position: Sort numbers DESC
			case this.RESOURCE_FIELD_VALUES.position + this.SORT_METHODS.desc.key:
				this.userResourceDataSortedForBlocks = this.helperService.sortNumbersDescending(this.RESOURCE_FIELD_VALUES.position, this.userResourceData);
				break;

			// ID: Sort string ASC
			case this.RESOURCE_FIELD_VALUES.id + this.SORT_METHODS.asc.key:
				this.userResourceDataSortedForBlocks = this.helperService.sort(this.RESOURCE_FIELD_VALUES.id, this.userResourceData);
				break;

			// ID: Sort string DESC
			case this.RESOURCE_FIELD_VALUES.id + this.SORT_METHODS.desc.key:
				this.userResourceDataSortedForBlocks = this.helperService.sortDescending(this.RESOURCE_FIELD_VALUES.id, this.userResourceData);
				break;

			// Title: Sort string ASC
			case this.RESOURCE_FIELD_VALUES.title + this.SORT_METHODS.asc.key:
				this.userResourceDataSortedForBlocks = this.helperService.sort(this.RESOURCE_FIELD_VALUES.title, this.userResourceData);
				break;

			// Title: Sort string DESC
			case this.RESOURCE_FIELD_VALUES.title + this.SORT_METHODS.desc.key:
				this.userResourceDataSortedForBlocks = this.helperService.sortDescending(this.RESOURCE_FIELD_VALUES.title, this.userResourceData);
				break;

			// Status (key): Sort string ASC
			case this.RESOURCE_FIELD_VALUES.statusKey + this.SORT_METHODS.asc.key:
				this.userResourceDataSortedForBlocks = this.helperService.sort(this.RESOURCE_FIELD_VALUES.statusKey, this.userResourceData);
				break;

			// Status (key): Sort string DESC
			case this.RESOURCE_FIELD_VALUES.statusKey + this.SORT_METHODS.desc.key:
				this.userResourceDataSortedForBlocks = this.helperService.sortDescending(this.RESOURCE_FIELD_VALUES.statusKey, this.userResourceData);
				break;

			// Last change: Sort string ASC
			case this.RESOURCE_FIELD_VALUES.lastChange + this.SORT_METHODS.asc.key:
				this.userResourceDataSortedForBlocks = this.helperService.sort(this.RESOURCE_FIELD_VALUES.lastChange, this.userResourceData);
				break;

			// Last change: Sort string DESC
			case this.RESOURCE_FIELD_VALUES.lastChange + this.SORT_METHODS.desc.key:
			default:
				this.userResourceDataSortedForBlocks = this.helperService.sortDescending(this.RESOURCE_FIELD_VALUES.lastChange, this.userResourceData);
				break;
		}
	}

}

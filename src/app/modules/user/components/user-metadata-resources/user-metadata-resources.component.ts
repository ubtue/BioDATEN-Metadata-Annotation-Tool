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
			key: "new"
		},
		progress: {
			label: "In progress",
			key: "progress"
		},
		finished: {
			label: "Finished",
			key: "finished"
		}
	};

	userResourceData: MetadataUserResource[] = [];

	sortableUserResourceData: any = [];

	displayedColumns: string[] = ['position', 'id', 'title', 'lastChange', 'status'];
	dataSource: any = [];

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	/**
	 * constructor
	 */
	constructor(private router: Router,
				private cdRef: ChangeDetectorRef,
				private updateNavigationService: UpdateNavigationService,
				private keycloakService: KeycloakService) { }


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
		this.sort.sort(({ id: 'lastChange', start: 'desc'}) as MatSortable);
		this.dataSource.sort = this.sort;

		this.dataSource.paginator = this.paginator;

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

}

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
		this.updateNavigationService.updateCurrentView(
			"Metadata resources:",
			this.keycloakService.userInformation.firstName! + " " + this.keycloakService.userInformation.lastName!);
	}


	/**
	 * ngAfterViewInit
	 */
	ngAfterViewInit() {

		// Get the data that is used for the table
		this.userResourceData = [
			{ position: 1, id: "34232-234245-88964", title: "Title", lastChange: "2021-10-18", status: "new"},
			{ position: 2, id: "13353-564547-23453", title: "Title", lastChange: "2021-10-17", status: "new"},
			{ position: 3, id: "63564-287434-25332", title: "Title", lastChange: "2021-08-21", status: "new"},
			{ position: 4, id: "18744-564345-63563", title: "Title", lastChange: "2021-10-11", status: "new"},
			{ position: 5, id: "45542-457842-32452", title: "Title", lastChange: "2021-10-14", status: "new"},
			{ position: 6, id: "74562-953453-94342", title: "Title", lastChange: "2021-09-28", status: "new"},
			{ position: 7, id: "98653-643542-24535", title: "Title", lastChange: "2021-06-30", status: "new"},
			{ position: 8, id: "73422-876345-86742", title: "Title", lastChange: "2021-07-10", status: "new"},
			{ position: 9, id: "78764-654221-76452", title: "Title", lastChange: "2021-08-20", status: "new"},
			{ position: 10, id: "05645-057643-25255", title: "Title", lastChange: "2021-06-20", status: "new"},
			{ position: 11, id: "26322-764321-36311", title: "Title", lastChange: "2020-12-11", status: "new"},
			{ position: 12, id: "13533-555421-13542", title: "Title", lastChange: "2021-04-10", status: "new"},
			{ position: 13, id: "34221-563225-74243", title: "Title", lastChange: "2021-06-19", status: "new"},
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

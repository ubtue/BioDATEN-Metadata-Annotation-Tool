import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';

import { UserRoutingModule } from './user-routing.module';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserMetadataResourcesComponent } from './components/user-metadata-resources/user-metadata-resources.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
	declarations: [
		UserProfileComponent,
		UserMetadataResourcesComponent
	],
	imports: [
		CommonModule,
		UserRoutingModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule
	]
})
export class UserModule { }

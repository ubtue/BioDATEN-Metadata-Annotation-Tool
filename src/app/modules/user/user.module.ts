import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';

import { UserRoutingModule } from './user-routing.module';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserMetadataResourcesComponent } from './components/user-metadata-resources/user-metadata-resources.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserProfileApiKeyComponent } from './components/user-profile/user-profile-api-key/user-profile-api-key.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
	declarations: [
		UserProfileComponent,
		UserProfileApiKeyComponent,
		UserMetadataResourcesComponent
	],
	imports: [
		CommonModule,
		UserRoutingModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatFormFieldModule,
		MatSelectModule,
		FormsModule,
		MatIconModule,
		SharedModule
	]
})
export class UserModule { }

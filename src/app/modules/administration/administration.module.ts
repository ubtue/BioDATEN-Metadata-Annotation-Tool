import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';

import { AdministrationRoutingModule } from './administration-routing.module';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AdministrationComponent } from './components/administration/administration.component';
import { AdministrationAutocompleteComponent } from './components/administration-autocomplete/administration-autocomplete.component';
import { AdministrationSchemasComponent } from './components/administration-schemas/administration-schemas.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AdministrationRenderOptionsComponent } from './components/administration-render-options/administration-render-options.component';
import { AdministrationRenderOptionsDetailsComponent } from './components/administration-render-options/administration-render-options-details/administration-render-options-details.component';


@NgModule({
	declarations: [
		AdministrationComponent,
 		AdministrationAutocompleteComponent,
   		AdministrationSchemasComponent,
     	AdministrationRenderOptionsComponent,
     	AdministrationRenderOptionsDetailsComponent
  	],
	imports: [
		CommonModule,
		AdministrationRoutingModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatFormFieldModule,
		MatSelectModule,
		MatIconModule,
		SharedModule,
		FormsModule
	]
})
export class AdministrationModule { }

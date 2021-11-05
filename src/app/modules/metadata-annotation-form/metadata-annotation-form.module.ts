import { SharedModule } from './../shared/shared.module';
import { LoadingScreenComponent } from './../shared/components/loading-screen/loading-screen.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetadataAnnotationFormRoutingModule } from './metadata-annotation-form-routing.module';
import { MetadataAnnotationFormTestComponent } from './components/metadata-annotation-form-test/metadata-annotation-form-test.component';
import { MetadataAnnotationFormComponent } from './components/metadata-annotation-form/metadata-annotation-form.component';
import { MetadataAnnotationFormTestMultiComponent } from './components/metadata-annotation-form-test-multi/metadata-annotation-form-test-multi.component';
import { MetadataAnnotationFormTestMultiOutputComponent } from './components/metadata-annotation-form-test-multi-output/metadata-annotation-form-test-multi-output.component';
import { MetadataAnnotationFormTestXmlInputComponent } from './components/metadata-annotation-form-test-xml-input/metadata-annotation-form-test-xml-input.component';
import { DirectivesModule } from '../shared/directives/directives.module';

@NgModule({
	declarations: [
		MetadataAnnotationFormTestComponent,
		MetadataAnnotationFormComponent,
		MetadataAnnotationFormTestMultiComponent,
		MetadataAnnotationFormTestMultiOutputComponent,
		MetadataAnnotationFormTestXmlInputComponent
	],
	imports: [
		CommonModule,
		MetadataAnnotationFormRoutingModule,
		FormsModule,
		DirectivesModule,
		SharedModule
	],
})
export class MetadataAnnotationFormModule { }

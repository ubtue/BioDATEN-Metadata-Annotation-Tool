import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetadataAnnotationFormRoutingModule } from './metadata-annotation-form-routing.module';
import { MetadataAnnotationFormTestComponent } from './components/metadata-annotation-form-test/metadata-annotation-form-test.component';
import { MetadataAnnotationFormComponent } from './components/metadata-annotation-form/metadata-annotation-form.component';
import { MetadataAnnotationFormTestMultiComponent } from './components/metadata-annotation-form-test-multi/metadata-annotation-form-test-multi.component';

@NgModule({
	declarations: [MetadataAnnotationFormTestComponent, MetadataAnnotationFormComponent, MetadataAnnotationFormTestMultiComponent],
	imports: [CommonModule, MetadataAnnotationFormRoutingModule, FormsModule],
})
export class MetadataAnnotationFormModule {}

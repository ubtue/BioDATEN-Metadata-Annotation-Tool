import { MetadataAnnotationFormTestXmlInputComponent } from './components/metadata-annotation-form-test-xml-input/metadata-annotation-form-test-xml-input.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetadataAnnotationFormTestMultiOutputComponent } from './components/metadata-annotation-form-test-multi-output/metadata-annotation-form-test-multi-output.component';
import { MetadataAnnotationFormTestMultiComponent } from './components/metadata-annotation-form-test-multi/metadata-annotation-form-test-multi.component';
import { MetadataAnnotationFormTestComponent } from './components/metadata-annotation-form-test/metadata-annotation-form-test.component';
import { MetadataAnnotationFormComponent } from './components/metadata-annotation-form/metadata-annotation-form.component';

const routes: Routes = [
	{ path: '', component: MetadataAnnotationFormComponent },
	{ path: 'test', component: MetadataAnnotationFormTestComponent },
	{ path: 'test-multi', component: MetadataAnnotationFormTestMultiComponent },
	{ path: 'test-multi-output', component: MetadataAnnotationFormTestMultiOutputComponent },
	{ path: 'test-xml-input', component: MetadataAnnotationFormTestXmlInputComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MetadataAnnotationFormRoutingModule {}

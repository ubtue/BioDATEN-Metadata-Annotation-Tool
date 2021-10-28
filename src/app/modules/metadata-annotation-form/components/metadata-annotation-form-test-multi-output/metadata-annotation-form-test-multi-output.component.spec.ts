import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingService } from 'src/app/modules/core/services/loading.service';

import { MetadataAnnotationFormTestMultiOutputComponent } from './metadata-annotation-form-test-multi-output.component';

describe('MetadataAnnotationFormTestMultiOutputComponent', () => {
	let component: MetadataAnnotationFormTestMultiOutputComponent;
	let fixture: ComponentFixture<MetadataAnnotationFormTestMultiOutputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MetadataAnnotationFormTestMultiOutputComponent],
			imports: [HttpClientModule, FormsModule],
			providers: [LoadingService],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(
			MetadataAnnotationFormTestMultiOutputComponent
		);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

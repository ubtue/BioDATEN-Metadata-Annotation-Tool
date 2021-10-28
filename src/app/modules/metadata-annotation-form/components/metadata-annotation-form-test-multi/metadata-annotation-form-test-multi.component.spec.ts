import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingService } from 'src/app/modules/core/services/loading.service';

import { MetadataAnnotationFormTestMultiComponent } from './metadata-annotation-form-test-multi.component';

describe('MetadataAnnotationFormTestMultiComponent', () => {
	let component: MetadataAnnotationFormTestMultiComponent;
	let fixture: ComponentFixture<MetadataAnnotationFormTestMultiComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MetadataAnnotationFormTestMultiComponent],
			imports: [HttpClientModule, FormsModule],
			providers: [LoadingService],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(
			MetadataAnnotationFormTestMultiComponent
		);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

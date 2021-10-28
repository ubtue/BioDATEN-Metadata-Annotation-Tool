import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingService } from 'src/app/modules/core/services/loading.service';

import { MetadataAnnotationFormComponent } from './metadata-annotation-form.component';

describe('MetadataAnnotationFormComponent', () => {
	let component: MetadataAnnotationFormComponent;
	let fixture: ComponentFixture<MetadataAnnotationFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MetadataAnnotationFormComponent],
			imports: [HttpClientModule, FormsModule],
			providers: [LoadingService],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MetadataAnnotationFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

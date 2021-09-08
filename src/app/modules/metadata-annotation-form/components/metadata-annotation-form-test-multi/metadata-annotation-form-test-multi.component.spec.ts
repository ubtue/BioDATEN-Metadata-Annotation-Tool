import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataAnnotationFormTestMultiComponent } from './metadata-annotation-form-test-multi.component';

describe('MetadataAnnotationFormTestMultiComponent', () => {
	let component: MetadataAnnotationFormTestMultiComponent;
	let fixture: ComponentFixture<MetadataAnnotationFormTestMultiComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MetadataAnnotationFormTestMultiComponent],
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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataAnnotationFormComponent } from './metadata-annotation-form.component';

describe('MetadataAnnotationFormComponent', () => {
	let component: MetadataAnnotationFormComponent;
	let fixture: ComponentFixture<MetadataAnnotationFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MetadataAnnotationFormComponent],
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

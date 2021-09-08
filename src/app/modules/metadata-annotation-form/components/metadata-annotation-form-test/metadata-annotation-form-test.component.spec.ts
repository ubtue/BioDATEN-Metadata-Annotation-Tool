import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetadataAnnotationFormTestComponent } from './metadata-annotation-form-test.component';


describe('MetadataAnnotationFormTestComponent', () => {
	let component: MetadataAnnotationFormTestComponent;
	let fixture: ComponentFixture<MetadataAnnotationFormTestComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MetadataAnnotationFormTestComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MetadataAnnotationFormTestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

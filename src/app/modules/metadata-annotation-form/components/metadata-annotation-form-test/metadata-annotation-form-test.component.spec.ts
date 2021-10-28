import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingService } from 'src/app/modules/core/services/loading.service';
import { MetadataAnnotationFormTestComponent } from './metadata-annotation-form-test.component';


describe('MetadataAnnotationFormTestComponent', () => {
	let component: MetadataAnnotationFormTestComponent;
	let fixture: ComponentFixture<MetadataAnnotationFormTestComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MetadataAnnotationFormTestComponent],
			imports: [HttpClientModule, FormsModule],
			providers: [LoadingService],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
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

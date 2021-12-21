import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationAutocompleteComponent } from './administration-autocomplete.component';

describe('AdministrationAutocompleteComponent', () => {
	let component: AdministrationAutocompleteComponent;
	let fixture: ComponentFixture<AdministrationAutocompleteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AdministrationAutocompleteComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AdministrationAutocompleteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

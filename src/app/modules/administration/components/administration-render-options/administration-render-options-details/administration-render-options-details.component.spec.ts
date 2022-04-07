import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationRenderOptionsDetailsComponent } from './administration-render-options-details.component';

describe('AdministrationRenderOptionsDetailsComponent', () => {
	let component: AdministrationRenderOptionsDetailsComponent;
	let fixture: ComponentFixture<AdministrationRenderOptionsDetailsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AdministrationRenderOptionsDetailsComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AdministrationRenderOptionsDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationRenderOptionsComponent } from './administration-render-options.component';

describe('AdministrationRenderOptionsComponent', () => {
	let component: AdministrationRenderOptionsComponent;
	let fixture: ComponentFixture<AdministrationRenderOptionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AdministrationRenderOptionsComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AdministrationRenderOptionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

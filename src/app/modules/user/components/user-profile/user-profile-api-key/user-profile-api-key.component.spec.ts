import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileApiKeyComponent } from './user-profile-api-key.component';

describe('UserProfileApiKeyComponent', () => {
	let component: UserProfileApiKeyComponent;
	let fixture: ComponentFixture<UserProfileApiKeyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UserProfileApiKeyComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserProfileApiKeyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

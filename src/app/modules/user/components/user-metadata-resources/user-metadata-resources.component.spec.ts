import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMetadataResourcesComponent } from './user-metadata-resources.component';

describe('UserMetadataResourcesComponent', () => {
  let component: UserMetadataResourcesComponent;
  let fixture: ComponentFixture<UserMetadataResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMetadataResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMetadataResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationSchemasComponent } from './administration-schemas.component';

describe('AdministrationSchemasComponent', () => {
  let component: AdministrationSchemasComponent;
  let fixture: ComponentFixture<AdministrationSchemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationSchemasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrationSchemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

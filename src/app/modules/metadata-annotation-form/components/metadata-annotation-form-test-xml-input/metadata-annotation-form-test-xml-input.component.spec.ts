import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingService } from 'src/app/modules/core/services/loading.service';

import { MetadataAnnotationFormTestXmlInputComponent } from './metadata-annotation-form-test-xml-input.component';

describe('MetadataAnnotationFormTestXmlInputComponent', () => {
  let component: MetadataAnnotationFormTestXmlInputComponent;
  let fixture: ComponentFixture<MetadataAnnotationFormTestXmlInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataAnnotationFormTestXmlInputComponent ],
	  imports: [HttpClientModule, FormsModule],
	  providers: [LoadingService],
	  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataAnnotationFormTestXmlInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { UpdateNavigationService } from './update-navigation.service';

describe('UpdateNavigationService', () => {
  let service: UpdateNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

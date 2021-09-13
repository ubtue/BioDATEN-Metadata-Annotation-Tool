import { TestBed } from '@angular/core/testing';
import { LoadingInterceptor } from '../interceptors/loading.interceptor';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
		providers: [LoadingInterceptor, LoadingService],
	});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

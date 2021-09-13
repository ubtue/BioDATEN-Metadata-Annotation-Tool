import { TestBed } from '@angular/core/testing';
import { LoadingService } from '../services/loading.service';

import { LoadingInterceptor } from './loading.interceptor';

describe('LoadingInterceptor', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [LoadingInterceptor, LoadingService],
		})
	);

	it('should be created', () => {
		const interceptor: LoadingInterceptor =
			TestBed.inject(LoadingInterceptor);
		expect(interceptor).toBeTruthy();
	});
});

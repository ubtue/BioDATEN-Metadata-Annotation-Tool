import { TestBed } from '@angular/core/testing';

import { HtmlHelperService } from './html-helper.service';

describe('HtmlHelperService', () => {
	let service: HtmlHelperService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(HtmlHelperService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

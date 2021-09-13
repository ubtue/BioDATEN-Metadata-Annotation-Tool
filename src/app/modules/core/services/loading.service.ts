import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {
	private isLoading$$ = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoading$$.asObservable();

	/**
	 * constructor
	 */
	constructor() {}


	/**
	 * setLoading
	 * @param isLoading
	 */
	setLoading(isLoading: boolean) {
		this.isLoading$$.next(isLoading);
	}
}

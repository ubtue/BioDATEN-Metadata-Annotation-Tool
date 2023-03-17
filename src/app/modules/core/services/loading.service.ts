import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {
	private isLoading$$ = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoading$$.asObservable();

	private isLoadingFullscreen$$ = new BehaviorSubject<boolean>(false);
	isLoadingFullscreen$ = this.isLoadingFullscreen$$.asObservable();

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

	/**
	 * setLoadingFullscreen
	 * @param isLoadingFullscreen
	 */
	 setLoadingFullscreen(isLoadingFullscreen: boolean) {
		this.isLoadingFullscreen$$.next(isLoadingFullscreen);
	}
}

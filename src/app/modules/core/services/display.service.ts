import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DisplayService {
	private isShowing$$ = new BehaviorSubject<boolean>(true);
	isShowing$ = this.isShowing$$.asObservable();

	/**
	 * constructor
	 */
	constructor() {}


	/**
	 * setShowing
	 * @param isShowing
	 */
	setShowing(isShowing: boolean) {
		this.isShowing$$.next(isShowing);
	}
}

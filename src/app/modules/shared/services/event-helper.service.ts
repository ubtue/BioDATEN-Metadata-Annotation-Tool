import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class EventHelperService {

	documentClickedTarget: Subject<HTMLElement> = new Subject<HTMLElement>();

	constructor() { }


	/**
	 * triggerDocumentClick
	 *
	 * Notifies the subscribtions that a element has been clicked
	 *
	 * @param target
	 */
	triggerDocumentClick(target: HTMLElement): void {
		this.documentClickedTarget.next(target);
	}
}

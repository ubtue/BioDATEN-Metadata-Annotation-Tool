import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[appAutocomplete]',
})
export class AutocompleteDirective {

	constructor(el: ElementRef) {
		// el.nativeElement.style.backgroundColor = 'yellow';
	}
}

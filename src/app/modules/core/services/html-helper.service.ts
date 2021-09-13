import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class HtmlHelperService {

	/**
	 * constructor
	 */
	constructor() {}


	/**
	 * setCustomFileTitle
	 *
	 * Sets the title of the custom file input label to the filename
	 *
	 * @param input
	 */
	setCustomFileTitle(input: HTMLInputElement) {

		// Get the parent label and check if it exists
		let parentLabel = input.closest('label.custom-file-input');

		if ( parentLabel ) {

			// Search for the span with the title
			let spanTitle = parentLabel.querySelector('.custom-file-input-title');

			if ( spanTitle ) {

				let fileNames = '';

				// Loop through all selected files and get the filename
				let files: FileList | null = input.files;

				for ( let i = 0; i < files!.length; i ++ ) {

					fileNames+= files![i].name;

					// Add a , if the file is not the last
					if ( i !== ( files!.length -1 ) ) {
						fileNames+= ', ';
					}
				}

				spanTitle.innerHTML = fileNames;
			}
		}
	}


	/**
	 * removeFormValidation
	 *
	 * Removes the automated form validation
	 *
	 * @param htmlString
	 * @returns
	 */
	removeFormValidation(htmlString: string): string {

		// Add novalidate to the form /*TODO*/
		htmlString = htmlString.replace('<form', '<form novalidate');

		return htmlString;
	}


	/**
	 * removeDoubleLegends
	 *
	 * Removes spans if the previous legend is the exact same text
	 *
	 * @param rootElement
	 */
	removeDoubleLegends(rootElement: HTMLElement): void {

		let labelSpans = rootElement.querySelectorAll('label > span');

		if ( labelSpans.length ) {

			labelSpans.forEach((labelSpan) => {

				let parentLegend = labelSpan.closest('label')?.parentNode?.querySelector('legend');

				if ( parentLegend ) {

					if ( parentLegend.innerHTML.includes(labelSpan.innerHTML) ) {
						labelSpan.remove();
					}
				}
			});
		}
	}
}

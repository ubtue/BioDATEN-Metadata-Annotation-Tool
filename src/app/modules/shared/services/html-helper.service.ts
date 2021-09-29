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


	/**
	 * addSectionsInFieldset
	 *
	 * Adds sections to labels directly following fieldsets
	 *
	 * @param rootElement
	 */
	addSectionsInFieldset(rootElement: HTMLElement): void {

		let labelsToChange = rootElement.querySelectorAll('fieldset > label');

		if ( labelsToChange.length ) {

			labelsToChange.forEach((label) => {

				let newSection = document.createElement('section') as HTMLElement;

				newSection.setAttribute('data-created', 'true');

				this.wrapNode(label, newSection);
			});
		}
	}


	/**
	 * addSectionsInFieldset
	 *
	 * Adds fieldsets to labels directly following sections
	 *
	 * @param rootElement
	 */
	addFieldsetsInSections(rootElement: HTMLElement): void {

		let labelsToChange = rootElement.querySelectorAll('section > label');

		if ( labelsToChange.length ) {

			labelsToChange.forEach((label) => {

				this.wrapNode(label, document.createElement('fieldset'));
			});
		}
	}


	/**
	 * markParentInputSections
	 *
	 * Sets a class to all sections that contain inputs
	 *
	 * @param rootElement
	 */
	markParentInputSections(rootElement: HTMLElement): void {

		let inputs = rootElement.querySelectorAll('input:not([type="button"]), select');

		if ( inputs.length ) {

			inputs.forEach((input) => {
				let closestSection = input.closest('section');

				if ( !closestSection?.querySelector('fieldset') && !closestSection?.querySelector('button') ) {
					closestSection?.classList.add('input-section');
				}

				if ( input.getAttribute('type') === 'radio' ) {
					input.closest('label')?.classList.add('stretch');
				}
			});
		}

	}


	/**
	 * wrapNode
	 *
	 * Wraps a node inside another element
	 *
	 * @param node
	 * @param wrapper
	 * @returns
	 */
	wrapNode(node: Node, wrapper?: HTMLElement): HTMLElement {

		wrapper = wrapper || document.createElement('div');

		// Cache the current parent and previous sibling of the first node.
		var parent = node.parentNode;
		var previousSibling = node.previousSibling;

		// Place node in wrapper
		wrapper.appendChild(node);

		// Place the wrapper just after the cached previousSibling,
		// or if that is null, just before the first child.
		var nextSibling = previousSibling ? previousSibling.nextSibling : parent!.firstChild;
		parent!.insertBefore(wrapper, nextSibling);

		return wrapper;
	}
}

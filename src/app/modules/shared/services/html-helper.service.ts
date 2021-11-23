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
						parentLegend.classList.add('child-span-removed');
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

		// Search all inputs and loop through them
		let inputs = rootElement.querySelectorAll('input:not([type="button"]), select');

		if ( inputs.length ) {

			inputs.forEach((input) => {

				// Find the closest section of the input element
				let closestSection = input.closest('section');

				// If the element already has the class skip it
				if ( !closestSection?.classList.contains('input-section') ) {

					// Check if the section has no child fieldsets or child buttons
					if ( !closestSection?.querySelector('fieldset') && !closestSection?.querySelector('button') ) {
						closestSection?.classList.add('input-section');
					}
				}

				// If the input is of type radio add the class "stretch"
				if ( input.getAttribute('type') === 'radio' ) {
					input.closest('label')?.classList.add('stretch');
				}

			});
		}
	}


	/**
	 * addDataCountToFieldset
	 *
	 * Adds a data-attribute to the parent fieldset to show how many
	 * input-section sections children there are.
	 * Also adds a indicator if the number is even or odd
	 *
	 * @param rootElement
	 */
	addDataCountToFieldset(rootElement: HTMLElement): void {

		// Find all fieldsets and loop through them
		let fieldsets = rootElement.querySelectorAll('fieldset');

		if ( fieldsets.length ) {

			fieldsets.forEach((fieldset) => {

				// Get all children of the fieldset
				let fieldsetChildren = fieldset.children;

				let inputSectionCount = 0;

				if ( fieldsetChildren.length ) {

					// Save the children to an array
					let fieldsetChildrenArray = Array.from(fieldsetChildren);

					// Loop through the array and add a class 'even' or 'odd' to the
					// child element if it's an section.input-section.
					// This needs to be resetted if another element is present
					let currentClass = 'odd';

					for ( let fieldsetChild of fieldsetChildrenArray ) {

						if ( fieldsetChild.classList.contains('input-section') && currentClass === 'odd' ) {

							// Add the odd class and change the current class to even
							fieldsetChild.classList.add('odd');

							currentClass = 'even';

						} else if ( fieldsetChild.classList.contains('input-section') && currentClass === 'even' ) {

							// Add the even class and change the current class to odd
							fieldsetChild.classList.add('even');

							currentClass = 'odd';
						} else {

							// If neither of the conditions is true, set the current class back to odd
							currentClass = 'odd';
						}
					}

					// Loop through the reveresed array and check how many section.input-section
					// There are before another element is present
					// This is the count needed to decide if the display is even or odd
					for ( let fieldsetChild of fieldsetChildrenArray.reverse() ) {

						if ( fieldsetChild.classList.contains('input-section') ) {
							inputSectionCount++;
						} else {
							break;
						}
					}
				}

				// If there are any put the number and even/odd in a data-attribute
				if ( inputSectionCount > 0 ) {
					fieldset.setAttribute('data-input-section-count', inputSectionCount.toString());

					fieldset.setAttribute(
						'data-input-section-even-odd',
						(inputSectionCount % 2 === 1 ? 'odd' : 'even')
					);
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

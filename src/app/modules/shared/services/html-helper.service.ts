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

					/* TODO: REMOVE?! */
					let closestSectionRadio = input.closest('section') as HTMLElement;
					closestSectionRadio.style.display = 'none';
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

					// REMOVE: Old version:
					// It is important that the first element AFTER the last element with the attribute 'data-created' is found.
					// The data-created attribute is added to elements that are xs:attribute within the xsd.
					// After the last xs:attribute the even/odd has to be set back to odd and an empty element to
					// force a new line has to be added.
					// The xs:attribute elements are always found clustered at the beginning of a fieldset so this only needs to be done
					// once during handling a single fieldset.
					// let dataCreatedHandled = false;

					// It is important that the last element with 'data-xsd2html2xml-type=attribute' is found
					// data-xsd2html2xml-type=attribute is added to elements that are xs:attribute within the xsd.
					// After the last xs:attribute the even/odd has to be set back to odd and an empty element to
					// force a new line has to be added.
					// The xs:attribute elements are always found clustered at the beginning of a fieldset so this only needs to be done
					// once during handling a single fieldset.
					let lastAttributeElementHandled = false;

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

						// If the last xs:attribute element has not been handled
						if ( !lastAttributeElementHandled ) {

							// Check if the following section has no data-xsd2html2xml-type=attribute as a direct child
							let nextSibling = fieldsetChild.nextElementSibling;

							if ( nextSibling ) {

								if ( !nextSibling.querySelector(':scope > [data-xsd2html2xml-type="attribute"]') ) {

									// Mark the current one as the last child
									fieldsetChild.setAttribute('data-last-attribute', '1');

									// Add a new element before the nextSibling with the class break and reset the currentClass to odd
									this.insertBreakDivBeforeElement(nextSibling);

									currentClass = 'odd';

									// Set handled flag to true
									lastAttributeElementHandled = true;
								}
							}
						}

						// REMOVE: Old version:
						// Check if the element has a data-created and it was not yet handled
						/*if ( !dataCreatedHandled && fieldsetChild.hasAttribute('data-created') ) {

							// Check if the next sibling does NOT have the attribute 'data-created'
							let nextSibling = fieldsetChild.nextElementSibling;

							if ( nextSibling && !nextSibling?.hasAttribute('data-created') ) {

								// Add a new element before the nextSibling with the class break and reset the currentClass to odd
								this.insertBreakDivBeforeElement(nextSibling);

								currentClass = 'odd';

								// Set handled flag to true
								dataCreatedHandled = true;
							}
						}*/
					}

					// Loop through the reveresed array and check how many section.input-section
					// There are before another element is present
					// This is the count needed to decide if the display is even or odd
					for ( let fieldsetChild of fieldsetChildrenArray.reverse() ) {

						if ( fieldsetChild.classList.contains('input-section') ) {

							if ( fieldsetChild.hasAttribute('data-last-attribute') ) {
								break;
							}

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
		var previousSibling = node.previousSibling as null | HTMLElement;

		// Place node in wrapper
		wrapper.appendChild(node);

		// Place the wrapper just after the cached previousSibling,
		// or if that is null, just before the first child.
		var nextSibling = previousSibling ? previousSibling.nextSibling : parent!.firstChild;
		parent!.insertBefore(wrapper, nextSibling);

		return wrapper;
	}


	/**
	 * selectOptionWithTimeout
	 *
	 * Selects an option of an select element with a timeout
	 *
	 * @param selectElement
	 */
	 selectOptionWithTimeout(selectElement: HTMLSelectElement, option: number, timeout: number): void {

		// Set timeout for selection
		window.setTimeout(
			() => {
				selectElement.selectedIndex = option;
			},
			timeout
		);
	}


	/**
	 * hideNotRevelevantSections
	 *
	 * Hides unwanted sections in the html form
	 *
	 * @param rootElement
	 */
	hideUnwantedSections(rootElement: HTMLElement) : void {

		// All unwanted section xpaths
		/*TODO: Get the data from the database*/
		let unwantedSectionsXpath = [
			'/premis/object',
			'/premis/event',
			'/premis/agent',
			'/premis/rights/rightsExtension'
		];

		// Loop through the xpaths
		for ( let i = 0; i < unwantedSectionsXpath.length; i++ ) {

			// Hide the parent section of the xpath
			let section  = rootElement.querySelector('[data-xsd2html2xml-xpath="' + unwantedSectionsXpath[i] + '"]')?.closest('section') as HTMLElement;

			if ( typeof section !== 'undefined' && section !== null ) {
				section.style.display = 'none';
			}
		}
	}


	/**
	 * insertBreakDivBeforeElement
	 *
	 * Inserts a break DIV before a given element
	 *
	 * @param element
	 */
	insertBreakDivBeforeElement(element: Element): void {

		// Create a new empty div with the class break
		let newDiv = document.createElement('div');
		newDiv.classList.add('break');

		// Add the new div before the element
		element.parentNode?.insertBefore(newDiv, element);
	}


	/**
	 * setPlaceholders
	 *
	 * Searches for elements with the custom placeholder attribute and sets that value to the following input or textarea element
	 */
	setPlaceholders(): void {

		// Get all elements with a placeholder
		let allPlaceholderElements = document.querySelectorAll('[data-xsd2html2xml-custom-placeholder]');

		// Loop through elements
		for ( let i = 0; i < allPlaceholderElements.length; i++ ) {

			// Get the placeholder text
			let placeholder = allPlaceholderElements[i].getAttribute('data-xsd2html2xml-custom-placeholder');

			if ( placeholder && placeholder !== '' ) {

				// Find the next input or textarea element
				let input = allPlaceholderElements[i].querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;

				input.setAttribute('placeholder', placeholder);
			}
		}
	}
}

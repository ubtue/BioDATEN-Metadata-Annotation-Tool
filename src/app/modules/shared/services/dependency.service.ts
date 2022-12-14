import { DependencyGroup } from './../models/dependency-group.model';
import { DependencySource } from './../models/dependency-source.model ';
import { SettingsService } from './settings.service';
import { Injectable } from '@angular/core';
import { Dependency } from '../models/dependency.model';


@Injectable({
	providedIn: 'root',
})
export class DependencyService {

	readonly dependencySeparator: string = ';';
	readonly dependencySeparatorSource: string = ':';
	readonly dependencySeparatorTarget: string = '--';

	firstInitDone: boolean = false;

	cachedDependencies: Dependency[] = [];


	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService) {}


	/**
	 * applyDependencies
	 *
	 * Applys the dependecies to the form
	 */
	applyDependencies(): void {

		// Get all parsed dependencies
		let dependencyGroups = this.getAllDependencies();

		// Loop through all dependency groups and apply them to the form
		for ( let i = 0; i < dependencyGroups.length; i++ ) {

			let currentDependencyGroup: DependencyGroup = dependencyGroups[i];

			// Get the dependencies for the current source element
			let currentDependencies: Dependency[] = currentDependencyGroup.dependencies;

			// Loop through all current dependencies
			for ( let j = 0; j < currentDependencies.length; j++ ) {

				let currentDependency = currentDependencies[j];

				// Get the target element
				let targetElement = document.querySelector(
					'[data-xsd2html2xml-name="' + currentDependency.targetElementName + '"]:not([data-dependency-init="1"]), [data-xsd2html2xml-name="cmdp:' + currentDependency.targetElementName + '"]:not([data-dependency-init="1"])'
				);

				if ( targetElement ) {

					// Handle the target element and get the target section
					let targetSection = this.handleTargetElementAndGetSection(targetElement, currentDependency.sourceElement, currentDependency.sourceOption);

					if ( targetSection ) {

						// Handle the source element
						this.handleSourceElement(currentDependency.sourceElement, currentDependency.sourceOption, targetSection, j, currentDependencies.length);
					}
				}

			}

			// Refresh all sub dependencies
			this.refreshAllSubDependencies();
		}

		// Only to this if this is the first time calling the function
		if ( this.firstInitDone === false ) {

			// Set the flag, that the first init is done
			this.firstInitDone = true;

			// Add an event listener to the custom event that triggers when a new section is added via the add button on the form
			window.addEventListener('xsd2html2xml-add-button', () => {

				// If the add button is used, call the apply Dependency function to add dependencies to the newly added elements
				this.applyDependencies();
			});
		}
	}


	/**
	 * getAllDependencySources
	 *
	 * Gets all the dependency sources from the form (custom data attribute)
	 *
	 * @returns
	 */
	private getAllDependencySources(): DependencySource[] {

		let dependencySources: DependencySource[] = [];

		// Search for all the dependencies within the document
		let elementsWithDependency = document.querySelectorAll('[data-xsd2html2xml-custom-dependency]:not([data-dependency-init="1"]');

		// Save the count of the different source elements for adding the dependency to the corrent array
		let sourceElementCount = 0;

		// Create the first entry of the array
		dependencySources[sourceElementCount] = {} as DependencySource;

		// If there are dependencies, loop through all elements and get the strings
		if ( elementsWithDependency.length > 0 ) {

			for ( let i = 0; i < elementsWithDependency.length; i++ ) {

				// Check if there is an entry in the current object.
				if ( dependencySources[sourceElementCount] && Object.keys(dependencySources[sourceElementCount]).length !== 0 ) {

					// Check if the source element has changed for the current dependency
					if ( elementsWithDependency[i-1] !== elementsWithDependency[i] ) {

						// Update the source element count
						sourceElementCount++;

						// Create a new object in the array
						dependencySources[sourceElementCount] = {} as DependencySource;
					}
				}

				// Create a dependency source
				let dependencySource: DependencySource = {
					dependencyString: '',
					sourceElement: null
				};

				// Check if the strings exists and save it to the dependecy
				if ( elementsWithDependency[i].getAttribute('data-xsd2html2xml-custom-dependency') && elementsWithDependency[i].getAttribute('data-xsd2html2xml-custom-dependency') !== '' ) {
					dependencySource.dependencyString = elementsWithDependency[i].getAttribute('data-xsd2html2xml-custom-dependency') as string;
				}

				// Check if source element select exists and save it to the dependecy
				if ( elementsWithDependency[i] ) {
					dependencySource.sourceElement = elementsWithDependency[i] as HTMLLabelElement;
				}

				// Save the dependency to the array
				dependencySources[sourceElementCount] = dependencySource;
			}
		}

		return dependencySources;
	}


	/**
	 * parseDependencies
	 *
	 * Parses the dependency string from the form to a an array of Dependency objects
	 *
	 * @param dependencySource
	 * @returns
	 */
	private parseDependencies(dependencySource: DependencySource): Dependency[] {

		let dependencies: Dependency[] = [];

		// Split multiple dependencies
		if ( dependencySource && dependencySource.dependencyString ) {

			let splittedDependenciesArray = dependencySource.dependencyString.split(this.dependencySeparator);

			if ( splittedDependenciesArray.length > 0 ) {

				// Loop through all dependencies and parse them
				for ( let i = 0; i < splittedDependenciesArray.length; i++ ) {

					let dependency: Dependency = {
						sourceElement: dependencySource.sourceElement,
						sourceOption: '',
						targetElementName: ''
					};

					// Split the second part of the array at the target separator
					let splittedForTargetArray = splittedDependenciesArray[i].split(this.dependencySeparatorTarget);

					if ( splittedForTargetArray.length > 1 ) {

						// The first part is the source option
						dependency.sourceOption = splittedForTargetArray[0].replace(/'/g, "");

						// The second part is the target element name
						dependency.targetElementName = splittedForTargetArray[1];
					}

					// Add the dependency to the array
					dependencies.push(dependency);
				}
			}
		}

		return dependencies;
	}


	/**
	 * getAllDependencies
	 *
	 * Get all dependencies of the form
	 *
	 * @returns
	 */
	private getAllDependencies(): DependencyGroup[] {

		let dependenciesGrouped: DependencyGroup[] = []

		// Get the dependency sources (array containg the dependency sources for each source element)
		let dependencySources: DependencySource[] = this.getAllDependencySources();

		// Parse the sources
		for ( let i = 0; i < dependencySources.length; i++ ) {

			let dependencies: Dependency[] = [];

			let parsedDependencies = this.parseDependencies(dependencySources[i]);

			// Loop through the results and add them to the array
			for ( let j = 0; j < parsedDependencies.length; j++ ) {
				dependencies.push(parsedDependencies[j]);
			}

			// Add all depencies to the group
			let dependencyGroup: DependencyGroup = {
				dependencies: dependencies
			};

			dependenciesGrouped.push(dependencyGroup);
		}

		return dependenciesGrouped;
	}



	/**
	 * handleTargetElementAndGetSection
	 *
	 * Handles the initial visibility of the target element and returns the target element parent section
	 *
	 * @param targetElement
	 * @param sourceElementName
	 * @param sourceOption
	 * @returns
	 */
	private handleTargetElementAndGetSection(targetElement: Element, sourceElement: HTMLLabelElement | null, sourceOption: string): HTMLElement | null {

		// Set a data attribute as a flag that the element has been initialized
		targetElement.setAttribute('data-dependency-init', '1');

		// Save the xpath of the source dependency within the target element
		let sourceXpath = sourceElement?.getAttribute('data-xsd2html2xml-xpath');

		if ( sourceXpath && sourceXpath !== '' ) {
			targetElement.setAttribute('data-dependency-source-xpath', sourceXpath);
		}

		// Check if the target element already has a dependency
		// If it has a dependecy, mark it as sub dependency
		if ( sourceElement && sourceElement.hasAttribute('data-xsd2html2xml-custom-dependency') ) {
			targetElement.setAttribute('data-sub-dependency', '1');
		}

		// Get the section above
		let targetSection = targetElement.closest('section');

		if ( targetSection ) {

			if ( sourceElement ) {

				// Get the source input element
				let sourceInput = sourceElement.querySelector('input, select') as HTMLInputElement | HTMLSelectElement;

				if ( sourceInput ) {

					// Check if the source element has the source option as value
					if ( sourceInput.value !== sourceOption ) {

						// Hide the section above
						targetSection.setAttribute('dependency-hidden', '');
					}
				}
			}

			return targetSection;
		}

		return null;
	}


	/**
	 * handleSourceElement
	 *
	 * Handles the change and input event of the source and the visibility of the target section
	 *
	 * @param sourceElement
	 * @param sourceOption
	 * @param targetSection
	 */
	private handleSourceElement(sourceElement: HTMLLabelElement | null, sourceOption: string, targetSection: HTMLElement, currentCount: number, totalCount: number): void {

		// // Get the source element TODO: How to handle the init for multiple values of the same input?
		// let sourceElement = document.querySelector(
		// 	'[data-xsd2html2xml-name="' + sourceElementName + '"]:not([data-dependency-init="1"]), [data-xsd2html2xml-name="cmdp:' + sourceElementName + '"]:not([data-dependency-init="1"])'
		// );
		// let sourceElement = document.querySelector(
		// 	'[data-xsd2html2xml-name="' + sourceElementName + '"]'
		// );

		if ( sourceElement ) {

			// Set a data attribute as a flag that the element has been initialized TODO: How to handle the init for multiple values of the same input?
			if ( currentCount+1 === totalCount ) {
				sourceElement.setAttribute('data-dependency-init', '1');
			}

			// For select elements use the change event:
			// Set an event handler for the change event of the source elements child input:
			// If the source element value equals the source option -> remove dependency-hidden from the target section
			let childInputSelect = sourceElement.querySelector('select');

			if ( childInputSelect ) {

				// If the source element already has the source option, remove the dependency-hidden attribute of the target
				if ( childInputSelect.value === sourceOption ) {
					targetSection.removeAttribute('dependency-hidden');
				}

				// Add event listener on change
				childInputSelect.addEventListener('change', (e) => {

					// Get the source input from the events target
					let sourceInput = e.target as HTMLSelectElement;

					// If the source input equals the dependency value show the target section
					if ( sourceInput.value === sourceOption ) {

						targetSection.removeAttribute('dependency-hidden');
					} else {

						// Hide the section above if the source input does not equal the dependency value
						targetSection.setAttribute('dependency-hidden', '');
					}

					// Refresh all sub dependencies
					this.refreshAllSubDependencies();
				});
			}

			// For input elements use the input event:
			// Set an event handler for the input event of the source elements child input:
			// If the source element value equals the source option -> remove dependency-hidden from the target section
			let childInput = sourceElement.querySelector('input');

			if ( childInput ) {

				// If the source element already has the source option, remove the dependency-hidden attribute of the target
				if ( childInput.value === sourceOption ) {
					targetSection.removeAttribute('dependency-hidden');
				}

				// Add event listener on input
				childInput.addEventListener('input', (e) => {

					// Get the source input from the events target
					let sourceInput = e.target as HTMLInputElement;

					// If the source input equals the dependency value show the target section
					if ( sourceInput.value === sourceOption ) {

						targetSection.removeAttribute('dependency-hidden');
					} else {

						// Hide the section above if the source input does not equal the dependency value
						targetSection.setAttribute('dependency-hidden', '');
					}

					// Refresh all sub dependencies
					this.refreshAllSubDependencies();
				});
			}
		}
	}


	/**
	 * refreshAllSubDependencies
	 *
	 * Handles the visibility of sub dependencies. If there are elements that only are displayed if a specific condition is met and this condition
	 * changes it might have an effect on other elements that are dependend on the now hidden element (sub dependencies).
	 * This function refreshes the visibilty of these elements.
	 */
	private refreshAllSubDependencies(): void {

		// Remove the sub-dependency-hidden attribute from all elements
		document.querySelectorAll('[sub-dependency-hidden]').forEach(element => {
			element.removeAttribute('sub-dependency-hidden');
		});

		// Get all elements with sub dependencies (ignore the elements that are hidden anyway)
		let elementsWithSubDependency = document.querySelectorAll('section:not([dependency-hidden]) > [data-sub-dependency="1"]');

		if ( elementsWithSubDependency.length > 0 ) {

			// Loop through all the elements
			for ( let i = 0; i < elementsWithSubDependency.length; i++ ) {

				let currentElement = elementsWithSubDependency[i];

				// Get the element that the looped element depends on
				if ( currentElement.hasAttribute('data-dependency-source-xpath') ) {

					// Get the xpath of the source element
					let sourceXpath = currentElement.getAttribute('data-dependency-source-xpath');

					if ( sourceXpath !== '' ) {

						// Get the source element
						/*NOTE: Currently this only works if the sub dependency is within the same fieldset.
						This is done to make sure it still works for elements that can be present multiple times (unbouded in xsd)
						Maybe there is a better to do this?*/
						let sourceElement = currentElement.closest('fieldset')?.querySelector('[data-xsd2html2xml-xpath="' + sourceXpath + '"]');

						// Check if the source element is not visible
						if ( sourceElement && sourceElement.closest('section')?.hasAttribute('dependency-hidden') ) {

							// Hide the element
							currentElement.closest('section')?.setAttribute('sub-dependency-hidden', '');

						}
					}
				}
			}
		}
	}
}

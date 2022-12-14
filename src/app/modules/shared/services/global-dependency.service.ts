import { SettingsService } from './settings.service';
import { Injectable } from '@angular/core';
import { Dependency } from '../models/dependency.model';


@Injectable({
	providedIn: 'root',
})
export class GlobalDependencyService {

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
		// The first time, get them from the form
		if ( this.firstInitDone === false ) {
			this.cachedDependencies = this.getAllDependencies();
		}

		// Loop through the dependencies and apply them to the form
		for ( let i = 0; i < this.cachedDependencies.length; i++ ) {

			let dependency = this.cachedDependencies[i];

			// Get all target elements
			let targetElements = document.querySelectorAll(
				'[data-xsd2html2xml-name="' + dependency.targetElementName + '"]:not([data-dependency-init="1"]), [data-xsd2html2xml-name="cmdp:' + dependency.targetElementName + '"]:not([data-dependency-init="1"])'
			);

			// Loop through all the target elements
			for ( let j = 0; j < targetElements.length; j++ ) {

				let targetElement = targetElements[j];

				if ( targetElement ) {

					// Handle the target element and get the target section
					let targetSection = this.handleTargetElementAndGetSection(targetElement, dependency.sourceElementName, dependency.sourceOption);

					if ( targetSection ) {

						// Handle the source element
						this.handleSourceElement(dependency.sourceElementName, dependency.sourceOption, targetSection);
					}
				}
			}
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
	 * getAllDependencyStrings
	 *
	 * Gets all the dependency strings from the form (custom data attribute)
	 *
	 * @returns
	 */
	private getAllDependencyStrings(): string[] {

		let dependencyStrings: string[] = [];

		// Search for all the dependencies within the document
		let elementsWithDependency = document.querySelectorAll('[data-xsd2html2xml-custom-dependency]');

		// If there are dependencies, loop through all elements and get the strings
		if ( elementsWithDependency.length > 0 ) {

			for ( let i = 0; i < elementsWithDependency.length; i++ ) {

				// Check if the strings exists and save it to the array
				if ( elementsWithDependency[i].getAttribute('data-xsd2html2xml-custom-dependency') && elementsWithDependency[i].getAttribute('data-xsd2html2xml-custom-dependency') !== '' ) {
					dependencyStrings.push(elementsWithDependency[i].getAttribute('data-xsd2html2xml-custom-dependency') as string);
				}
			}
		}

		return dependencyStrings;
	}


	/**
	 * parseDependencies
	 *
	 * Parses the dependency string from the form to a an array of Dependency objects
	 *
	 * @param dependencyString
	 * @returns
	 */
	private parseDependencies(dependencyString: string): Dependency[] {

		let dependencies: Dependency[] = [];

		// Split multiple dependencies
		let splittedDependenciesArray = dependencyString.split(this.dependencySeparator);

		if ( splittedDependenciesArray.length > 0 ) {

			// Loop through all dependencies and parse them
			for ( let i = 0; i < splittedDependenciesArray.length; i++ ) {

				let dependency: Dependency = {
					sourceElementName: '',
					sourceOption: '',
					targetElementName: ''
				};

				// Split the dependencyString at the separators to get the information
				let splittedForSourceArray = splittedDependenciesArray[i].split(this.dependencySeparatorSource);

				if ( splittedForSourceArray.length > 1 ) {

					// The source element name is the first part of the string
					dependency.sourceElementName = splittedForSourceArray[0];

					// Split the second part of the array at the target separator
					let splittedForTargetArray = splittedForSourceArray[1].split(this.dependencySeparatorTarget);

					if ( splittedForTargetArray.length > 1 ) {

						// The first part is the source option
						dependency.sourceOption = splittedForTargetArray[0];

						// The second part is the target element name
						dependency.targetElementName = splittedForTargetArray[1];
					}
				}

				// Add the dependency to the array
				dependencies.push(dependency);
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
	private getAllDependencies(): Dependency[] {

		let dependencies: Dependency[] = []

		// Get the dependency strings
		let dependencyStrings = this.getAllDependencyStrings();

		// Parse the strings
		for ( let i = 0; i < dependencyStrings.length; i++ ) {

			let parsedDependencies = this.parseDependencies(dependencyStrings[i]);

			// Loop through the results and add them to the array
			for ( let j = 0; j < parsedDependencies.length; j++ ) {
				dependencies.push(parsedDependencies[j]);
			}
		}

		return dependencies;
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
	private handleTargetElementAndGetSection(targetElement: Element, sourceElementName: string, sourceOption: string): HTMLElement | null {

		// Set a data attribute as a flag that the element has been initialized
		targetElement.setAttribute('data-dependency-init', '1');

		// Get the section above
		let targetSection = targetElement.closest('section');

		if ( targetSection ) {

			// Get the source element
			let sourceElement = document.querySelector(
				'[data-xsd2html2xml-name="' + sourceElementName + '"], [data-xsd2html2xml-name="cmdp:' + sourceElementName + '"]'
			);

			if ( sourceElement ) {

				// Get the source input element
				let sourceInput = sourceElement.querySelector('input, select') as HTMLInputElement | HTMLSelectElement;

				if ( sourceInput ) {

					// Check if the source element has the source option as value
					if ( sourceInput.value !== sourceOption ) {

						// Hide the section above
						targetSection.setAttribute('hidden', '');
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
	 * @param sourceElementName
	 * @param sourceOption
	 * @param targetSection
	 */
	private handleSourceElement(sourceElementName: string, sourceOption: string, targetSection: HTMLElement): void {

		// Get the source element TODO: How to handle the init for multiple values of the same input?
		// let sourceElement = document.querySelector(
		// 	'[data-xsd2html2xml-name="' + sourceElementName + '"]:not([data-dependency-init="1"]), [data-xsd2html2xml-name="cmdp:' + sourceElementName + '"]:not([data-dependency-init="1"])'
		// );
		let sourceElement = document.querySelector(
			'[data-xsd2html2xml-name="' + sourceElementName + '"], [data-xsd2html2xml-name="cmdp:' + sourceElementName + '"]'
		);

		if ( sourceElement ) {

			// Set a data attribute as a flag that the element has been initialized TODO: How to handle the init for multiple values of the same input?
			// sourceElement.setAttribute('data-dependency-init', '1');

			// For select elements use the change event:
			// Set an event handler for the change event of the source elements child input:
			// If the source element value equals the source option -> remove hidden from the target section
			let childInputSelect = sourceElement.querySelector('select');

			if ( childInputSelect ) {

				// If the source element already has the source option, remove the hidden attribute of the target
				if ( childInputSelect.value === sourceOption ) {
					targetSection.removeAttribute('hidden');
				}

				// Add event listener on change
				childInputSelect.addEventListener('change', (e) => {

					// Get the source input from the events target
					let sourceInput = e.target as HTMLSelectElement;

					// If the source input equals the dependency value show the target section
					if ( sourceInput.value === sourceOption ) {

						targetSection.removeAttribute('hidden');
					} else {

						// Hide the section above if the source input does not equal the dependency value
						targetSection.setAttribute('hidden', '');
					}
				});
			}

			// For input elements use the input event:
			// Set an event handler for the input event of the source elements child input:
			// If the source element value equals the source option -> remove hidden from the target section
			let childInput = sourceElement.querySelector('input');

			if ( childInput ) {

				// If the source element already has the source option, remove the hidden attribute of the target
				if ( childInput.value === sourceOption ) {
					targetSection.removeAttribute('hidden');
				}

				// Add event listener on input
				childInput.addEventListener('input', (e) => {

					// Get the source input from the events target
					let sourceInput = e.target as HTMLInputElement;

					// If the source input equals the dependency value show the target section
					if ( sourceInput.value === sourceOption ) {

						targetSection.removeAttribute('hidden');
					} else {

						// Hide the section above if the source input does not equal the dependency value
						targetSection.setAttribute('hidden', '');
					}
				});
			}
		}
	}
}

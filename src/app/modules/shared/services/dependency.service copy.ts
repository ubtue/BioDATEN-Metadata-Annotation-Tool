import { DependencySource } from './../models/dependency-source.model ';
import { SettingsService } from './settings.service';
import { Injectable } from '@angular/core';
import { Dependency } from '../models/dependency.model';


@Injectable({
	providedIn: 'root',
})
export class DependencyServiceTest {

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

		// Gather all dependecies by source elements
		let dependenciesBySource: any = {};

		// Loop through the dependencies and extract them by the source element
		for ( let i = 0; i < this.cachedDependencies.length; i++ ) {

			let dependency = this.cachedDependencies[i];

			// Check if dependencies for the source exist
			if ( typeof dependenciesBySource[dependency.sourceElementName] === 'undefined' ) {
				dependenciesBySource[dependency.sourceElementName] = [];
			}

			dependenciesBySource[dependency.sourceElementName].push(dependency);
		}

		// Loop through the dependencies by source element and apply them to the form
		Object.entries(dependenciesBySource).forEach(
			([key, value]) => {

				// Current dependencies with correct type
				let currentDependencies = value as Dependency[];

				for ( let i = 0; i < currentDependencies.length; i++ ) {

					let currentDependency = currentDependencies[i];

					// Get all target elements
					let targetElements = document.querySelectorAll(
						'[data-xsd2html2xml-name="' + currentDependency.targetElementName + '"]:not([data-dependency-init="1"]), [data-xsd2html2xml-name="cmdp:' + currentDependency.targetElementName + '"]:not([data-dependency-init="1"])'
					);

					// Loop through all the target elements
					for ( let j = 0; j < targetElements.length; j++ ) {

						let targetElement = targetElements[j];

						if ( targetElement ) {

							// Handle the target element and get the target section
							let targetSection = this.handleTargetElementAndGetSection(targetElement, currentDependency.sourceElementName, currentDependency.sourceOption);

							if ( targetSection ) {

								// Handle the source element
								this.handleSourceElement(key, currentDependency.sourceOption, targetSection, i, currentDependencies.length);
							}
						}
					}
				}

			}
		);

		// for ( let i = 0; i < this.cachedDependencies.length; i++ ) {

		// 	let dependency = this.cachedDependencies[i];

		// 	// Get all target elements
		// 	let targetElements = document.querySelectorAll(
		// 		'[data-xsd2html2xml-name="' + dependency.targetElementName + '"]:not([data-dependency-init="1"]), [data-xsd2html2xml-name="cmdp:' + dependency.targetElementName + '"]:not([data-dependency-init="1"])'
		// 	);

		// 	// Loop through all the target elements
		// 	for ( let j = 0; j < targetElements.length; j++ ) {

		// 		let targetElement = targetElements[j];

		// 		if ( targetElement ) {

		// 			// Handle the target element and get the target section
		// 			let targetSection = this.handleTargetElementAndGetSection(targetElement, dependency.sourceElementName, dependency.sourceOption);

		// 			if ( targetSection ) {

		// 				// Handle the source element
		// 				this.handleSourceElement(dependency.sourceElementName, dependency.sourceOption, targetSection);
		// 			}
		// 		}
		// 	}
		// }

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
		let elementsWithDependency = document.querySelectorAll('[data-xsd2html2xml-custom-dependency]');

		// If there are dependencies, loop through all elements and get the strings
		if ( elementsWithDependency.length > 0 ) {

			for ( let i = 0; i < elementsWithDependency.length; i++ ) {

				// Create a dependency
				let dependency: DependencySource = {
					dependencyString: '',
					sourceElementName: ''
				};

				// Check if the strings exists and save it to the dependecy
				if ( elementsWithDependency[i].getAttribute('data-xsd2html2xml-custom-dependency') && elementsWithDependency[i].getAttribute('data-xsd2html2xml-custom-dependency') !== '' ) {
					dependency.dependencyString = elementsWithDependency[i].getAttribute('data-xsd2html2xml-custom-dependency') as string;
				}

				// Check if source element select exists and save it to the dependecy
				if ( elementsWithDependency[i].querySelector('select') ) {
					dependency.sourceElementName = elementsWithDependency[i].getAttribute('data-xsd2html2xml-name') as string;
				}

				// Save the dependency to the array
				dependencySources.push(dependency);
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
		let splittedDependenciesArray = dependencySource.dependencyString.split(this.dependencySeparator);

		if ( splittedDependenciesArray.length > 0 ) {

			// Loop through all dependencies and parse them
			for ( let i = 0; i < splittedDependenciesArray.length; i++ ) {

				let dependency: Dependency = {
					sourceElementName: dependencySource.sourceElementName,
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

		// Get the dependency sources
		let dependencySources: DependencySource[] = this.getAllDependencySources();

		// Parse the sources
		for ( let i = 0; i < dependencySources.length; i++ ) {

			let parsedDependencies = this.parseDependencies(dependencySources[i]);

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
				'[data-xsd2html2xml-name="' + sourceElementName + '"]:not([data-dependency-init="1"])'
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
	private handleSourceElement(sourceElementName: string, sourceOption: string, targetSection: HTMLElement, currentCount: number, totalCount: number): void {
console.log(totalCount + 'vs');
console.log(currentCount+1);
		// Get the source element TODO: How to handle the init for multiple values of the same input?
		let sourceElement = document.querySelector(
			'[data-xsd2html2xml-name="' + sourceElementName + '"]:not([data-dependency-init="1"]), [data-xsd2html2xml-name="cmdp:' + sourceElementName + '"]:not([data-dependency-init="1"])'
		);
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

import { FormValidationService } from './../../../shared/services/form-validation.service';
import { AutoincrementService } from './../../../shared/services/autoincrement.service';
import { OidcService } from './../../../core/services/oidc.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { RenderHelperService } from './../../../shared/services/render-helper.service';
import { UserResourceService } from './../../../shared/services/user-data.service';
import { MetadataAnnotationFormHelperService } from './../../services/metadata-annotation-form-helper.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { DataTransferService } from '../../../core/services/data-transfer.service';
import { MetadataPostRequest } from 'src/app/modules/shared/models/metadata-post-request.model';
import { MetadataServerResponse } from 'src/app/modules/shared/models/metadata-server-response.model';
import { MetadataCreatedTab } from './../../../shared/models/metadata-created-tab.model';
import { LoadingService } from '../../../core/services/loading.service';
import { UpdateNavigationService } from '../../../core/services/update-navigation.service';
import { MetadataCreatedTabContent } from 'src/app/modules/shared/models/metadata-created-tab-content.model';
import { HelperService } from '../../../shared/services/helper.service';
import { HtmlHelperService } from '../../../shared/services/html-helper.service';
import { AutocompleteService } from '../../../shared/services/autocomplete.service';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DependencyService } from 'src/app/modules/shared/services/dependency.service';


@Component({
	selector: 'app-metadata-annotation-form-test-xml-input',
	templateUrl: './metadata-annotation-form-test-xml-input.component.html',
	styleUrls: ['./metadata-annotation-form-test-xml-input.component.scss'],
})

export class MetadataAnnotationFormTestXmlInputComponent implements OnInit {

	serverAddress: string = '';
	serverAdressXMLInput: string = this.settingsService.metadataAnnotationFormServerAddress + 'xml-input/';

	serverAdressXMLAddress: string = this.settingsService.metadataAnnotationFormServerAddress + 'xml-system/';
	serverAdressXMLAddressWithMetsId: string = this.settingsService.metadataAnnotationFormServerAddress + 'xml/';

	currentTab: string = '';
	saveEnabled: boolean = false;

	toggleAutoComplete: boolean = true;

	createdTabs: MetadataCreatedTab[] = [];

	onInputTimeout: any = null;

	hideSettings: boolean = false;

	@ViewChild('templateTab') templateTab!: ElementRef;
	@ViewChild('templateTabContent') templateTabContent!: ElementRef;

	@ViewChild('inputFilesTemplate') inputFilesTemplate!: ElementRef;
	@ViewChild('inputFilesXML') inputFilesXML!: ElementRef;


	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService,
				private dataTransferService: DataTransferService,
				private updateNavigationService: UpdateNavigationService,
				public loadingService: LoadingService,
				private helperService: HelperService,
				private metadataAnnotationFormHelperService: MetadataAnnotationFormHelperService,
				private htmlHelperService: HtmlHelperService,
				private autocompleteService: AutocompleteService,
				public oidcSecurityService: OidcSecurityService,
				private oidcService: OidcService,
				private router: Router,
				private route: ActivatedRoute,
				private userResourceService: UserResourceService,
				private renderHelperService: RenderHelperService,
				private dependencyService: DependencyService,
				private autoincrementService: AutoincrementService,
				private formValidationService: FormValidationService) {

					// Get the server address
					this.serverAddress = this.settingsService.backendServerAddress;
				}


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {
		this.currentTab = 'settings';

		this.updateNavigationService.updateCurrentView("Metadata for resource:", "");

		// Check if there is an id as a GET param -> send to handler
		if (this.route.snapshot.queryParamMap.get("id") !== null ) {
			this.hideSettings = true;
			this.handleGetResourceId(this.route.snapshot.queryParamMap.get("id"));
		}
	}


	/**
	 * onClickTab
	 * @param tabName
	 */
	onClickTab(tabName: string): void {
		this.activateTab(tabName);
	}


	/**
	 * onClickTest
	 */
	onClickTest(): void {
		this.dataTransferService.getData(this.settingsService.autocompleteSchemasServerAddress).then(
			(result: any) => {
				console.log(result);
			}
		);
	}


	/**
	 * onClickLoadSchema
	 * @param schema
	 */
	onClickLoadSchema(schema: string): void {
		this.loadSingleSchema(schema);
	}


	/**
	 * onClickSave
	 */
	onClickSave():void {

		if ( this.settingsService.enableConsoleLogs ) {
			console.log('Saving the data...');
		}

		this.saveXMLData();
	}

	/**
	 * onClickReset
	 */
	onClickReset(): void {
		// this.router.navigate(["annotation/test-xml-input"]).then(
		// 	() => {
		// 		window.location.reload();
		// 	}
		// );

		window.location.reload();
	}


	/**
	 * onChangeFileInput
	 * @param input
	 */
	onChangeFileInput(input: HTMLInputElement) {
		this.htmlHelperService.setCustomFileTitle(input);
	}


	/**
	 * onSubmitMultipleFiles
	 */
	onSubmitMultipleFiles(): void {

		let filesXML = this.inputFilesXML.nativeElement.files as FileList;

		if ( filesXML.length > 0 ) {
			this.loadSchemas(filesXML);
		} else {
			alert('At least one XML file needs to be selected.');
		}
	}

	/**
	 * onSubmitMultipleTemplates
	 */
	onSubmitMultipleTemplates(): void {

		let templateFiles = this.inputFilesTemplate.nativeElement.files as FileList;

		if ( templateFiles.length > 0 ) {
			this.loadMultipleSchemas(templateFiles);
		} else {
			alert('At least one template file needs to be selected');
		}
	}


	/**
	 * onClickResourceLink
	 * @param event
	 */
	onClickResourceLink(event: Event): void {

		event.preventDefault();

		this.getDataByResourceId("22586-5596337946-21147");

	}


	/**
	 * activateTab
	 *
	 * Handles the navigation of the tabs
	 *
	 * @param tabName
	 */
	private activateTab(tabName: string): void {

		// Declare all variables
		let i, tabcontent, tablinks;

		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.getElementsByClassName('tabcontent');
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].classList.remove('active');
		}

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.getElementsByClassName('tablink');
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].classList.remove('active');
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		document
			.querySelector('div.tabcontent[data-tab="' + tabName + '"]')
			?.classList.add('active');
		document
			.querySelector('button.tablink[data-tab="' + tabName + '"]')
			?.classList.add('active');

		this.currentTab = tabName;

		// Update the save button state
		this.updateSaveButton();
	}


	/**
	 * addTab
	 *
	 * Adds a tab to the sidebar
	 *
	 * @param tabName
	 * @param tabNameDisplay
	 * @param addTabContent
	 */
	private addTab(tabName: string, tabNameDisplay: string, addTabContent?: boolean): MetadataCreatedTab {

		if ( this.settingsService.enableConsoleLogs ) {
			console.log('creating tab "' + tabNameDisplay + '" with internal name "' + tabName + '"');
		}

		// Clone the template tab and add/remove specific properties
		let clonedTab = this.templateTab.nativeElement.cloneNode(true) as HTMLElement;

		// Remove the tab-hidden class so the new tab is shown
		clonedTab.classList.remove('tab-hidden');

		// Add the correct tabName to the data and the corret display name
		clonedTab.setAttribute('data-tab', tabName);
		clonedTab.innerHTML = tabNameDisplay;

		// Bind click event
		clonedTab.addEventListener('click', (event) => {
			this.activateTab(tabName);
		});

		this.templateTab.nativeElement.parentNode.insertBefore(clonedTab, this.templateTab.nativeElement);

		let tabContentElement = null;

		// Add tab content?
		if ( addTabContent ) {
			tabContentElement = this.addTabContent(tabName, true) as HTMLElement;
		}

		let createdTabContent = new MetadataCreatedTabContent(clonedTab, tabContentElement);

		let createdTab = new MetadataCreatedTab(tabName, createdTabContent);

		// Add the created content to the global array
		this.createdTabs.push(createdTab);

		return createdTab;
	}


	/**
	 * addTabContent
	 *
	 * Adds a content block corresponding to a tab
	 *
	 * @param tabName
	 * @param returnElement
	 * @returns
	 */
	private addTabContent(tabName: string, returnElement?: boolean): HTMLElement | void {

		if ( this.settingsService.enableConsoleLogs ) {
			console.log('creating tab content for "' + tabName + '"');
		}

		// Clone the template tab content and add/remove specific properties
		let clonedTabContent = this.templateTabContent.nativeElement.cloneNode(true) as HTMLElement;

		// Add the correct tabName to the data and the corret display name
		clonedTabContent.setAttribute('data-tab', tabName);
		clonedTabContent.innerHTML = "TEST";

		this.templateTabContent.nativeElement.parentNode.insertBefore(clonedTabContent, this.templateTabContent.nativeElement);

		// Can return the element if desired
		if ( returnElement ) {
			return clonedTabContent;
		}
	}


	/**
	 * selectFirstTab
	 *
	 * Selects first tab (DOM hierarchy)
	 */
	private selectFirstTab(): void {

		if ( this.createdTabs.length > 0 ) {
			let firstTab = document.querySelector('.metadata-annotation-form-menu button[data-tab="' + this.createdTabs[0].tabName + '"]') as HTMLElement;
			firstTab.click();
		}
	}


	/**
	 * scrollToInput
	 *
	 * Scrolls to an specific input field
	 *
	 * @param inputElement
	 */
	private scrollToInput(inputElement: HTMLElement): void {

		// Get the tab name
		let tabName = inputElement.closest('div[data-tab]')?.getAttribute('data-tab') as string;

		// Activate the tab
		this.activateTab(tabName);

		// Scroll to the inputElement
		// Check if the function 'scrollIntoViewIfNeeded' is available
		// @ts-ignore: Browser specific (Not all browsers support the function scrollIntoViewIfNeeded)
		if ( typeof inputElement.scrollIntoViewIfNeeded !== 'undefined' && typeof inputElement.scrollIntoViewIfNeeded === 'function' ) {
			// @ts-ignore: Browser specific (Not all browsers support the function scrollIntoViewIfNeeded)
			inputElement.scrollIntoViewIfNeeded();
		} else {
			inputElement.scrollIntoView();
		}
	}


	/**
	 * updateSaveButton
	 *
	 * Checks if the save button should be enabled
	 */
	private updateSaveButton(): void {

		if ( document.querySelector('div.tabcontent[data-tab="' + this.currentTab + '"] form.xsd2html2xml') ) {
			this.saveEnabled = true;
		} else {
			this.saveEnabled = false;
		}
	}


	/**
	 * loadSchemas
	 *
	 * Loads all schemas present in the given XML
	 *
	 * @param filesXML
	 */
	private loadSchemas(filesXML: FileList): void {

		let formDatas = this.helperService.fileListsToFormDataXML(filesXML);

		let postRequest: MetadataPostRequest;

		// Take the first and only entry in formData and make the post request
		if ( formDatas.length > 0 ) {
			postRequest = (new MetadataPostRequest(this.serverAdressXMLInput, formDatas[0]));

			// Send the post requests
			this.dataTransferService.postData(postRequest.url, postRequest.body).then(
				(results: any) => {

					// Create the tabs for all schemas
					this.createTabsForAllSchemas(results);

					// Load the JS for all schemas
					this.loadJSForAllSchemas(results).then(
						() => {
							this.activateAutocomplete(this.createdTabs);
							this.metadataAnnotationFormHelperService.replaceOntologyIdentifiers();
						}
					);
				}
			);
		}
	}

	/**
	 * loadSingleSchema
	 *
	 * Loads a single predefined schema
	 *
	 * @param schema
	 */
	private loadSingleSchema(schema: string): void {

		// console.log('Getting form data from service for schema ' + schema + '...');

		// // get the selected schema from the server
		// this.dataTransferService
		// 	.getData('http://localhost:8080/xsdnojs/' + schema, 'json')
		// 	.then((result: any) => {
		// 		console.log('Result from getting data for ' + schema);

		// 		let resultElement;

		// 		switch ( schema ) {

		// 			case 'biodatenMinimal':
		// 				resultElement = this.formResultBiodatenMinimal;
		// 				break;

		// 			case 'premis':
		// 				resultElement = this.formResultPremis;
		// 				break;

		// 			case 'datacite':
		// 				resultElement = this.formResultDatacite;
		// 				break;

		// 			default:
		// 				resultElement = this.formResultCustom;
		// 		}



		// 		resultElement.nativeElement.innerHTML = this.customizeHTML(result['html']);

		// 		this.removeDoubleLegends(resultElement.nativeElement);

		// 		// load the js file and execute the code
		// 		this.dataTransferService.getData("assets/xsd2html2xml/js/xsd2html2xml-global.js?" + Date.now(), "text").then(
		// 			((resultFile: any) => {

		// 				eval(resultFile);

		// 				const event = new Event('ubtuejk');
		// 				window.dispatchEvent(event);

		// 				// update the save button state
		// 				this.updateSaveButton();

		// 			})
		// 		);
		// 	});
	}


	/**
	 * loadMultipleSchemas
	 *
	 * Loads multiple schemas to the page that are selected via file input
	 *
	 * @param filesTemplate
	 * @param filesXML
	 */
	private loadMultipleSchemas(filesTemplate: FileList, filesXML?: FileList): void {

		if ( this.settingsService.enableConsoleLogs ) {
			console.log('loading schemas:');
			console.log(filesTemplate);

			console.log('adding content from files:');
			console.log(filesXML);
		}

		let formDatas = this.helperService.fileListsToFormDataTemplate(filesTemplate, filesXML);

		let postRequests: MetadataPostRequest[] = [];

		// Loop through the FromDatas and create the post requests
		formDatas.forEach((formData: FormData) => {
			postRequests.push(new MetadataPostRequest(this.serverAddress, formData));
		});

		// Send the post requests
		this.dataTransferService.postDataMultiple(postRequests).then(
			(results: MetadataServerResponse[]) => {

				// Create the tabs for all schemas
				this.createTabsForAllSchemas(results);

				// Load the JS for all schemas
				this.loadJSForAllSchemas(results).then(
					() => {
						this.activateAutocomplete(this.createdTabs);
						this.metadataAnnotationFormHelperService.replaceOntologyIdentifiers();
					}
				);
			}
		);
	}


	/**
	 * loadSingleSchemaByFile
	 *
	 * Loads a single schema by file
	 *
	 * @param fileTemplate
	 * @param fileXML
	 */
	private loadSingleSchemaByFile(fileTemplate: File, fileXML?: File): void {

		if (fileTemplate) {

			if ( this.settingsService.enableConsoleLogs ) {
				console.log(
					'Parsing data at server for template file "' +
						fileTemplate.name +
						'"...'
				);
			}

			const formData: FormData = new FormData();
			formData.append('file', fileTemplate, fileTemplate.name);


			// Check if there is an xml file to fill the inputs
			if (fileXML) {
				formData.append('fileXML', fileXML, fileXML.name);
			} else {
				formData.append('fileXML', '');
			}

			// Send the files to the server for parsing
			this.dataTransferService
				.postData('http://193.196.20.98/xsdnojs', formData)
				.then((result: any) => {

					if ( this.settingsService.enableConsoleLogs ) {
						console.log('Parsing complete!');
					}

					let currentTabContent: any | null = document.querySelector(
						'div.tabcontent[data-tab="custom"]'
					);

					currentTabContent.innerHTML = this.htmlHelperService.removeFormValidation(result['html']);

					// load the jsfile an execute the code
					this.dataTransferService.getData("assets/xsd2html2xml/js/xsd2html2xml-global.js?" + Date.now(), "text").then(
						((resultFile: any) => {

							resultFile = resultFile.replaceAll('<<REPLACE>>', this.helperService.removeFileExtension(fileTemplate.name));
							eval(resultFile);

							const event = new Event('load' + this.helperService.removeFileExtension(fileTemplate.name));
							window.dispatchEvent(event);

							// update the save button state
							this.updateSaveButton();

						})
					);

					this.activateTab('custom');
				});
			}
	}


	/**
	 * handleGetResourceId
	 *
	 * Handler for the resource ID
	 *
	 * @param resourceId
	 */
	private handleGetResourceId(resourceId: string | null): void {

		if ( resourceId !== null ) {

			// Check if the passed resource ID is correct
			if ( this.evaluateResourceId(resourceId) ) {

				// Get the data for the passed resource ID
				this.getDataByResourceId(resourceId);
			}
		}
	}


	/**
	 * evaluateResourceId
	 *
	 * Evaluates the resource ID.
	 *
	 * @param resourceId
	 * @returns
	 */
	private evaluateResourceId(resourceId: string): boolean {

		return true;
	}


	/**
	 * getDataByResourceId
	 *
	 * Gets metadata from server by the corresponding resource ID
	 *
	 * @param resourceId
	 */
	private getDataByResourceId(resourceId: string): void {

		this.dataTransferService.getData(this.serverAdressXMLAddressWithMetsId + resourceId).then(
			(results: MetadataServerResponse[]) => {

				// Create the tabs for all schemas
				this.createTabsForAllSchemas(results);

				// Load the JS for all schemas
				this.loadJSForAllSchemas(results).then(
					() => {

						// Add autocomplete functionality
						this.activateAutocomplete(this.createdTabs);

						// Replaces the ontology identifiers with the human readable value
						this.metadataAnnotationFormHelperService.replaceOntologyIdentifiers();

						// Apply the custom render options
						this.renderHelperService.applyRenderOptions();

						// Apply the dependencies
						this.dependencyService.applyDependencies();

						// Handle the autoincrement
						this.autoincrementService.handleAutoincrement();

						// Update the navigation
						this.updateNavigationService.updateCurrentView("Metadata for resource:", resourceId);

						// Select the first tab
						this.selectFirstTab();
					}
				);
			}
		)
	}


	/**
	 * createTabsForAllSchemas
	 *
	 * Creates the tabs and the content elements for all fetched schemas
	 *
	 * @param results
	 */
	private createTabsForAllSchemas(results: MetadataServerResponse[]): void {

		if ( this.settingsService.enableConsoleLogs ) {
			console.log(results);
			console.log(typeof results);
		}

		// Loop through each result and add the content to the page
		results.forEach((result: MetadataServerResponse) => {

			let createdTab = this.addTab(
				this.helperService.removeFileExtension(result.schema),
				this.mapTabNames(
					this.helperService.removeFileExtension(result.schema)
				),
				true
			);

			let createdTabContent = createdTab.tabContent?.contentElement;

			// If there is a content element, display the result html there
			if ( createdTabContent ) {

				createdTabContent.innerHTML = result.html;

				// If NOT in flex layout: Remove double legends
				if ( this.settingsService.metadataAnnotationFormFlexLayout === false ) {
					this.htmlHelperService.removeDoubleLegends(createdTabContent);
				}

				// In flex layout: Add sections around fieldsets without fieldsets
				if ( this.settingsService.metadataAnnotationFormFlexLayout === true ) {
					this.htmlHelperService.addSectionsInFieldset(createdTabContent);
				}

				// Mark the parent sections of inputs
				this.htmlHelperService.markParentInputSections(createdTabContent);

				// REMOVE: This is now handled in the administration
				// Hide the unwanted sections
				// this.htmlHelperService.hideUnwantedSections(createdTabContent);

				// In flex layout: Add a count of the input-sections to the parent fieldset
				if ( this.settingsService.metadataAnnotationFormFlexLayout === true ) {
					this.htmlHelperService.addDataCountToFieldset(createdTabContent);
				}
			}

		});
	}

	/**
	 * loadJSForAllSchemas
	 *
	 * Loads the JS for all fetched schemas
	 *
	 * @param results
	 */
	private loadJSForAllSchemas(results: MetadataServerResponse[]): Promise<void> {

		// Load the jsfile an execute the code
		return this.dataTransferService.getData("assets/xsd2html2xml/js/xsd2html2xml-global.js?" + Date.now(), "text").then(
			((resultFile: any) => {

				results.forEach((result: MetadataServerResponse) => {

					let changedResultFile = resultFile
						.replaceAll('<<REPLACE_FULL>>', result.schema)
						.replaceAll('<<REPLACE>>', this.helperService.removeFileExtension(result.schema));

					eval(changedResultFile);

					// Dispatch the custom event to trigger the code
					const event = new Event('load' + this.helperService.removeFileExtension(result.schema));
					window.dispatchEvent(event);
				});

				// Update the save button state
				this.updateSaveButton();

			})
		);
	}


	/**
	 * activateAutocomplete
	 *
	 * Activates the autocomplete for all content in desired tabs
	 */
	private activateAutocomplete(tabs: MetadataCreatedTab[]): void {

		// Loop through all created tabs and bind a oninput function to the text inputs
		tabs.forEach((tab: MetadataCreatedTab) => {

			// Don't select inputs that already have the event bound
			// (There elements hat the data-autocomplete-flag attribute)
			let allTextInputs = tab.tabContent?.contentElement?.querySelectorAll('input[type="text"]:not([data-autocomplete-flag]), input[type="url"]:not([data-autocomplete-flag])') as NodeList;

			if ( allTextInputs && allTextInputs.length > 0 ) {

				// Bind the input event and call the function for autocomplete init
				// and hand over the text input as an argument
				allTextInputs.forEach((textInput: Node) => {

					let textInputElement = textInput as HTMLElement;

					textInput.addEventListener(
						'input',
						(event) => {
							this.autocompleteOnInput(event.target as HTMLInputElement)
						},
						false
					);

					// Set a flag that autocomplete was init
					textInputElement.setAttribute('data-autocomplete-flag', 'true');
				});
			}

			// Make sure that the newly created nodes (via add buttons)
			// also can use the autocomplete function.
			// The problem here is that the function cloneNode does not clone event listeners.
			// Don't select buttons that already have the event bound
			// (There buttons hat the data-autocomplete-flag attribute)
			let addButtons = tab.tabContent?.contentElement?.querySelectorAll('button.add:not([data-autocomplete-flag])');

			addButtons?.forEach(addButton => {
				addButton.addEventListener('click', () => {
					this.activateAutocomplete(this.createdTabs);
				});

				// Set a flag that autocomplete was init
				addButton.setAttribute('data-autocomplete-flag', 'true');
			});


		});

		// Add the ontologies to the inputs
		this.autocompleteService.addOntologiesToInputs();
	}


	/**
	 * autocompleteOnInput
	 *
	 * Handles the inputs on a autocomplete element
	 *
	 * @param event
	 */
	private autocompleteOnInput(input: HTMLInputElement): void {

		// If the autocomplete data for the element is not yet loaded
		// use a timeout to make sure that the app waits at least 1.5 seconds
		// for the code to execute so that there won't be too many requests if the user
		// types a longer word

		// if ( this.autocompleteService.checkIfAutocompleteNotInit(input) ||
		// 	 this.autocompleteService.checkIfAutocompleteInitIsInProgress(input) ) {

		// 	if ( this.onInputTimeout !== null ) {
		// 		clearTimeout(this.onInputTimeout);
		// 		this.onInputTimeout = null;
		// 	}

		// 	this.onInputTimeout = window.setTimeout(
		// 		() => {

		// 			// handle autocomplete for the input element
		// 			this.autocompleteService.handleAutocomplete(input);

		// 			// Set the variable back to null
		// 			this.onInputTimeout = null;
		// 		},
		// 		1500
		// 	);
		// } else {

		// 	// handle autocomplete for the input element
		// 	this.autocompleteService.handleAutocomplete(input);
		// }
		if ( this.toggleAutoComplete ) {
			this.autocompleteService.handleAutocomplete(input);
		}


	}


	/**
	 * saveXMLData
	 *
	 * Saves the XML data
	 */
	private saveXMLData(): void {

		let invalidElement = this.formValidationService.checkIfAutocompleteIsValid();

		// Check if the form is valid
		if ( invalidElement === null ) {

			// Create the XML Data
			let xmlData = this.metadataAnnotationFormHelperService.createXMLData(this.createdTabs);

			if ( xmlData ) {

				// Add the XML structure to it
				xmlData = this.helperService.addXMLStructure(xmlData);

				if ( this.settingsService.enableConsoleLogs ) {
					console.log(xmlData);
				}

				// Save the changes to the database
				// Get resource id
				let resourceId = this.route.snapshot.queryParamMap.get("id") as string;
				if ( typeof resourceId !== 'undefined' && resourceId !== '' ) {

					// Get User ID (only continue if user is logged in)
					this.oidcSecurityService.userData$.subscribe(userData => {

						let userId = this.oidcService.getUserIdFromUserData(userData);

						if ( userId !== '' ) {
							this.userResourceService.updateUserResource(resourceId, userId, xmlData, 'progress');
						}
				});

					// REMOVE: OLD
					// Get User ID (only continue if user is logged in)
					/*if ( typeof this.keycloakService.userInformation.id !== 'undefined' && this.keycloakService.userInformation.id !== '' ) {
						let userId = this.keycloakService.userInformation.id as string;

						this.userResourceService.updateUserResource(resourceId, userId, xmlData);
					}*/
				}
			}

		} else {

			// Scroll to the invalid input element
			this.scrollToInput(invalidElement);
		}
	}


	/**
	 * mapTabNames
	 *
	 * Maps the tab names to the schemas
	 *
	 * @param tabName
	 * @returns
	 */
	private mapTabNames(tabName: string): string {

		let result: string = '';

		switch (tabName.toLowerCase()) {

			case 'datacite':
				result = 'Descriptive Metadata';
				break;

			case 'premis':
				result = 'File Metadata';
				break;

			case 'biodatenminimal':
				result = 'Research Metadata';
				break;

			default:
				result = tabName;
				break;
		}

		return result;
	}


	/**
	 * debug
	 * @param input
	 */
	debug(input: any): void {

		if ( this.settingsService.enableConsoleLogs ) {
			console.log(input.closest('label').querySelector('span.custom-file-input-title'));
		}
	}
}

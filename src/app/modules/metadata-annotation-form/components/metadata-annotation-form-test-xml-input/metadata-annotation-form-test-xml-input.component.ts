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

@Component({
	selector: 'app-metadata-annotation-form-test-xml-input',
	templateUrl: './metadata-annotation-form-test-xml-input.component.html',
	styleUrls: ['./metadata-annotation-form-test-xml-input.component.scss'],
})

export class MetadataAnnotationFormTestXmlInputComponent implements OnInit {

	serverAddress: string = 'http://localhost:8080/xsdnojs';
	serverAdressXMLInput: string = 'http://localhost:8080/xsdnojs/xml-input';

	currentTab: string = '';
	saveEnabled: boolean = false;

	toggleAutoComplete: boolean = false;

	createdTabs: MetadataCreatedTab[] = [];

	onInputTimeout: any = null;

	@ViewChild('templateTab') templateTab!: ElementRef;
	@ViewChild('templateTabContent') templateTabContent!: ElementRef;

	@ViewChild('inputFilesTemplate') inputFilesTemplate!: ElementRef;
	@ViewChild('inputFilesXML') inputFilesXML!: ElementRef;

	constructor(private dataTransferService: DataTransferService,
				private updateNavigationService: UpdateNavigationService,
				public loadingService: LoadingService,
				private helperService: HelperService,
				private htmlHelperService: HtmlHelperService,
				private autocompleteService: AutocompleteService) {}

	ngOnInit(): void {
		this.currentTab = 'settings';

		this.updateNavigationService.updateCurrentView("TEST XML Input");
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
		this.addTab("datacite", "Datacite", true);
		this.addTab("premis", "Premis", true);
	}


	/**
	 * onClickLoadScheme
	 * @param scheme
	 */
	onClickLoadScheme(scheme: string): void {
		this.loadSingleScheme(scheme);
	}


	/**
	 * onClickSave
	 */
	onClickSave():void {
		console.log('Saving the data...');

		this.saveXMLData();
	}

	/**
	 * onClickReset
	 */
	onClickReset(): void {
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
			this.loadSchemes(filesXML);
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
			this.loadMultipleSchemes(templateFiles);
		} else {
			alert('At least one template file needs to be selected');
		}
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
			tablinks[i].className = tablinks[i].className.replace(
				' active',
				''
			);
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
		console.log('creating tab "' + tabNameDisplay + '" with internal name "' + tabName + '"');

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
		console.log('creating tab content for "' + tabName + '"');

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
	 * loadSchemes
	 *
	 * Loads all schemes present in the given XML
	 *
	 * @param filesXML
	 */
	private loadSchemes(filesXML: FileList): void {

		let formDatas = this.helperService.fileListsToFormDataXML(filesXML);

		let postRequest: MetadataPostRequest;

		// Take the first and only entry in formData and make the post request
		if ( formDatas.length > 0 ) {
			postRequest = (new MetadataPostRequest(this.serverAdressXMLInput, formDatas[0]));

			// Send the post requests
			this.dataTransferService.postData(postRequest.url, postRequest.body).then(
				(results: any) => {

					// Create the tabs for all schemes
					this.createTabsForAllSchemes(results);

					// Load the JS for all schemes
					this.loadJSForAllSchemes(results).then(
						() => {
							this.activateAutocomplete(this.createdTabs);
						}
					);
				}
			);
		}
	}

	/**
	 * loadSingleScheme
	 *
	 * Loads a single predefined scheme
	 *
	 * @param scheme
	 */
	private loadSingleScheme(scheme: string): void {

		// console.log('Getting form data from service for scheme ' + scheme + '...');

		// // get the selected scheme from the server
		// this.dataTransferService
		// 	.getData('http://localhost:8080/xsdnojs/' + scheme, 'json')
		// 	.then((result: any) => {
		// 		console.log('Result from getting data for ' + scheme);

		// 		let resultElement;

		// 		switch ( scheme ) {

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
	 * loadMultipleSchemes
	 *
	 * Loads multiple schemes to the page that are selected via file input
	 *
	 * @param filesTemplate
	 * @param filesXML
	 */
	private loadMultipleSchemes(filesTemplate: FileList, filesXML?: FileList): void {

		console.log('loading schemes:');
		console.log(filesTemplate);

		console.log('adding content from files:');
		console.log(filesXML);

		let formDatas = this.helperService.fileListsToFormDataTemplate(filesTemplate, filesXML);

		let postRequests: MetadataPostRequest[] = [];

		// Loop through the FromDatas and create the post requests
		formDatas.forEach((formData: FormData) => {
			postRequests.push(new MetadataPostRequest(this.serverAddress, formData));
		});

		// Send the post requests
		this.dataTransferService.postDataMultiple(postRequests).then(
			(results: MetadataServerResponse[]) => {

				// Create the tabs for all schemes
				this.createTabsForAllSchemes(results);

				// Load the JS for all schemes
				this.loadJSForAllSchemes(results).then(
					() => {
						this.activateAutocomplete(this.createdTabs);
					}
				);
			}
		);
	}


	/**
	 * loadSingleSchemeByFile
	 *
	 * Loads a single scheme by file
	 *
	 * @param fileTemplate
	 * @param fileXML
	 */
	private loadSingleSchemeByFile(fileTemplate: File, fileXML?: File): void {

		if (fileTemplate) {
			console.log(
				'Parsing data at server for template file "' +
					fileTemplate.name +
					'"...'
			);

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
				.postData('http://localhost:8080/xsdnojs', formData)
				.then((result: any) => {
					console.log('Parsing complete!');

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
	 * createTabsForAllSchemes
	 *
	 * Creates the tabs and the content elements for all fetched schemes
	 *
	 * @param results
	 */
	private createTabsForAllSchemes(results: MetadataServerResponse[]): void {

		console.log(results);
		console.log(typeof results);

		// Loop through each result and add the content to the page
		results.forEach((result: MetadataServerResponse) => {

			let createdTab = this.addTab(
				this.helperService.removeFileExtension(result.scheme),
				this.mapTabNames(
					this.helperService.removeFileExtension(result.scheme)
				),
				true
			);

			let createdTabContent = createdTab.tabContent?.contentElement;

			// If there is a content element, display the result html there
			if ( createdTabContent ) {
				createdTabContent.innerHTML = result.html;
				// this.htmlHelperService.removeDoubleLegends(createdTabContent);
				this.htmlHelperService.addSectionsInFieldset(createdTabContent);
				this.htmlHelperService.markParentInputSections(createdTabContent);
			}

		});
	}

	/**
	 * loadJSForAllSchemes
	 *
	 * Loads the JS for all fetched schemes
	 *
	 * @param results
	 */
	private loadJSForAllSchemes(results: MetadataServerResponse[]): Promise<void> {

		// Load the jsfile an execute the code
		return this.dataTransferService.getData("assets/xsd2html2xml/js/xsd2html2xml-global.js?" + Date.now(), "text").then(
			((resultFile: any) => {

				results.forEach((result: MetadataServerResponse) => {

					let changedResultFile = resultFile
						.replaceAll('<<REPLACE_FULL>>', result.scheme)
						.replaceAll('<<REPLACE>>', this.helperService.removeFileExtension(result.scheme));

					eval(changedResultFile);

					// Dispatch the custom event to trigger the code
					const event = new Event('load' + this.helperService.removeFileExtension(result.scheme));
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
			let allTextInputs = tab.tabContent?.contentElement?.querySelectorAll('input[type="text"]:not([data-autocomplete-flag])') as NodeList;

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
			console.log(addButtons);

			addButtons?.forEach(addButton => {
				addButton.addEventListener('click', () => {
					this.activateAutocomplete(this.createdTabs);
				});

				// Set a flag that autocomplete was init
				addButton.setAttribute('data-autocomplete-flag', 'true');
			});


		});
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

		this.autocompleteService.handleAutocomplete(input);

	}


	/**
	 * saveXMLData
	 *
	 * Saves the XML data
	 */
	private saveXMLData(): void {

		let xmlData = this.createXMLData();

		if ( xmlData ) {
			xmlData = this.helperService.addXMLStructure(xmlData);

			console.log(xmlData);
		}
	}


	/**
	 * createXMLData
	 *
	 * Creates the XML data from all created tabs
	 *
	 * @returns
	 */
	private createXMLData(): string {

		let xmlData = '';

		// Loop through every tab an save the data
		if ( this.createdTabs.length > 0 ) {

			this.createdTabs.forEach((createdTab: MetadataCreatedTab) => {

				if ( createdTab.tabContent?.contentElement?.querySelector('form.xsd2html2xml') ) {

					// Get the filename of the scheme
					let schemeFilename = createdTab.tabContent?.contentElement?.querySelector('span[data-scheme-file]')?.getAttribute('data-scheme-file') as string;

					if ( schemeFilename ) {

						// Get the XML data of the tab
						xmlData += (window as any)['xsd2html2xml'][this.helperService.removeFileExtension(schemeFilename)].htmlToXML(
							createdTab.tabContent?.contentElement?.querySelector('form.xsd2html2xml'),
							'newScheme scheme="' + this.helperService.removeFileExtension(schemeFilename) + '"',
							'newScheme'
						)
					}
				}
			});
		}

		return xmlData;
	}

	/**
	 * mapTabNames
	 *
	 * Maps the tab names to the schemes
	 *
	 * @param tabName
	 * @returns
	 */
	private mapTabNames(tabName: string): string {

		let result: string = '';

		switch (tabName.toLowerCase()) {

			case 'datacite':
				result = 'Datacite';
				break;

			case 'premis':
				result = 'Premis';
				break;

			case 'biodatenminimal':
				result = 'BioDATEN Minimal';
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
		console.log(input.closest('label').querySelector('span.custom-file-input-title'));
	}
}

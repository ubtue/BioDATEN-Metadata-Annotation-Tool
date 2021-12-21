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

@Component({
	selector: 'app-metadata-annotation-form-test',
	templateUrl: './metadata-annotation-form-test-multi.component.html',
	styleUrls: ['./metadata-annotation-form-test-multi.component.scss'],
})

export class MetadataAnnotationFormTestMultiComponent implements OnInit {

	serverAddress: string = 'http://localhost:8080/xsd';

	currentTab: string = '';
	saveEnabled: boolean = false;

	createdTabs: MetadataCreatedTab[] = [];

	@ViewChild('templateTab') templateTab!: ElementRef;
	@ViewChild('templateTabContent') templateTabContent!: ElementRef;

	@ViewChild('inputFilesTemplate') inputFilesTemplate!: ElementRef;
	@ViewChild('inputFilesXML') inputFilesXML!: ElementRef;

	constructor(private dataTransferService: DataTransferService,
				private updateNavigationService: UpdateNavigationService,
				public loadingService: LoadingService,
				private helperService: HelperService,
				private htmlHelperService: HtmlHelperService) {}

	ngOnInit(): void {
		this.currentTab = 'settings';

		this.updateNavigationService.updateCurrentView("Metadata for resource:", "TEST MULTI Import");
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
		console.log('Saving the data...');

		if ( document.querySelector('div.tabcontent[data-tab="' + this.currentTab + '"] form.xsd2html2xml') ) {

			let schemaFilename = document.querySelector('div.tabcontent[data-tab="' + this.currentTab + '"] span[data-schema-file]')?.getAttribute('data-schema-file') as string;

			console.log(
				(window as any)['xsd2html2xml'][this.helperService.removeFileExtension(schemaFilename)].htmlToXML(
					document.querySelector('div.tabcontent[data-tab="' + this.currentTab + '"] form.xsd2html2xml')
				)
			);
		}


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
	 * onSubmitSingleFile
	 */
	onSubmitSingleFile(): void {

		let fileTemplate = this.inputFilesTemplate.nativeElement
			.files[0] as File;

		let fileXML = this.inputFilesXML.nativeElement.files[0] as File;

		this.loadSingleSchemaByFile(fileTemplate, fileXML);

	}


	/**
	 * onSubmitMultipleFiles
	 */
	onSubmitMultipleFiles(): void {

		let filesTemplate = this.inputFilesTemplate.nativeElement.files as FileList;

		let filesXML = this.inputFilesXML.nativeElement.files as FileList;

		if ( filesTemplate.length > 0 ) {
			this.loadMultipleSchemas(filesTemplate, filesXML);
		} else {
			alert('At least one template file (xsd) needs to be selected.');
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
	private loadMultipleSchemas(filesTemplate: FileList, filesXML: FileList): void {

		console.log('loading schemas:');
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
						this.htmlHelperService.removeDoubleLegends(createdTabContent);
					}

				});


				// Load the jsfile an execute the code
				this.dataTransferService.getData("assets/xsd2html2xml/js/xsd2html2xml-global.js?" + Date.now(), "text").then(
					((resultFile: any) => {

						results.forEach((result: MetadataServerResponse) => {

							let changedResultFile = resultFile
								.replaceAll('<<REPLACE_FULL>>', result.schema)
								.replaceAll('<<REPLACE>>', this.helperService.removeFileExtension(result.schema))
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

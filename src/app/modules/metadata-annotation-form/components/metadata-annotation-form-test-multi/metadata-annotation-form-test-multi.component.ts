import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { DataTransferService } from '../../../core/services/data-transfer.service';
import { MetadataPostRequest } from 'src/app/modules/shared/models/metadata-post-request.model';
import { MetadataServerResponse } from 'src/app/modules/shared/models/metadata-server-response.model';
import { MetadataCreatedTab } from './../../../shared/models/metadata-created-tab.model';
import { LoadingService } from '../../../core/services/loading.service';
import { UpdateNavigationService } from '../../../shared/services/update-navigation.service';
import { MetadataCreatedTabContent } from 'src/app/modules/shared/models/metadata-created-tab-content.model';

@Component({
	selector: 'app-metadata-annotation-form-test',
	templateUrl: './metadata-annotation-form-test-multi.component.html',
	styleUrls: ['./metadata-annotation-form-test-multi.component.scss'],
})

export class MetadataAnnotationFormTestMultiComponent implements OnInit {

	serverAddress: string = 'http://localhost:8080/xsdnojs';

	currentTab: string = '';
	saveEnabled: boolean = false;

	createdTabs: MetadataCreatedTab[] = [];

	@ViewChild('templateTab') templateTab!: ElementRef;
	@ViewChild('templateTabContent') templateTabContent!: ElementRef;

	@ViewChild('inputFilesTemplate') inputFilesTemplate!: ElementRef;
	@ViewChild('inputFilesXML') inputFilesXML!: ElementRef;

	constructor(private dataTransferService: DataTransferService,
				private updateNavigationService: UpdateNavigationService,
				public loadingService: LoadingService) {}

	ngOnInit(): void {
		this.currentTab = 'settings';

		this.updateNavigationService.updateCurrentView("TEST MULTI");
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

		if ( document.querySelector('div.tabcontent[data-tab="' + this.currentTab + '"] form.xsd2html2xml') ) {

			let schemeFilename = document.querySelector('div.tabcontent[data-tab="' + this.currentTab + '"] span[data-scheme-file]')?.getAttribute('data-scheme-file') as string;

			console.log((window as any)['xsd2html2xml'][schemeFilename].htmlToXML(document.querySelector('div.tabcontent[data-tab="' + this.currentTab + '"] form.xsd2html2xml')));
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
		this.setCustomFileTitle(input);
	}

	/**
	 * onSubmitSingleFile
	 */
	onSubmitSingleFile(): void {

		let fileTemplate = this.inputFilesTemplate.nativeElement
			.files[0] as File;

		let fileXML = this.inputFilesXML.nativeElement.files[0] as File;

		this.loadSingleSchemeByFile(fileTemplate, fileXML);

	}


	/**
	 * onSubmitMultipleFiles
	 */
	onSubmitMultipleFiles(): void {

		let filesTemplate = this.inputFilesTemplate.nativeElement.files as FileList;

		let filesXML = this.inputFilesXML.nativeElement.files as FileList;

		if ( filesTemplate.length > 0 ) {
			this.loadMultipleSchemes(filesTemplate, filesXML);
		} else {
			alert('At least one template file (xsd) needs to be selected.');
		}


	}


	/**
	 * activateTab
	 *
	 * handles the navigation of the tabs
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

		// update the save button state
		this.updateSaveButton();
	}


	/**
	 * addTab
	 *
	 * adds a tab to the sidebar
	 *
	 * @param tabName
	 * @param tabNameDisplay
	 * @param addTabContent
	 */
	private addTab(tabName: string, tabNameDisplay: string, addTabContent?: boolean): MetadataCreatedTab {
		console.log('creating tab "' + tabNameDisplay + '" with internal name "' + tabName + '"');

		// clone the template tab and add/remove specific properties
		let clonedTab = this.templateTab.nativeElement.cloneNode(true) as HTMLElement;

		// remove the tab-hidden class so the new tab is shown
		clonedTab.classList.remove('tab-hidden');

		// add the correct tabName to the data and the corret display name
		clonedTab.setAttribute('data-tab', tabName);
		clonedTab.innerHTML = tabNameDisplay;

		// bind click event
		clonedTab.addEventListener('click', (event) => {
			this.activateTab(tabName);
		});

		this.templateTab.nativeElement.parentNode.insertBefore(clonedTab, this.templateTab.nativeElement);

		let tabContentElement = null;

		// add tab content?
		if ( addTabContent ) {
			tabContentElement = this.addTabContent(tabName, true) as HTMLElement;
		}

		let createdTabContent = new MetadataCreatedTabContent(clonedTab, tabContentElement);

		let createdTab = new MetadataCreatedTab(tabName, createdTabContent);

		// add the created content to the global array
		this.createdTabs.push(createdTab);

		return createdTab;
	}


	/**
	 * addTabContent
	 *
	 * adds a content block corresponding to a tab
	 *
	 * @param tabName
	 * @param returnElement
	 * @returns
	 */
	private addTabContent(tabName: string, returnElement?: boolean): HTMLElement | void {
		console.log('creating tab content for "' + tabName + '"');

		// clone the template tab content and add/remove specific properties
		let clonedTabContent = this.templateTabContent.nativeElement.cloneNode(true) as HTMLElement;

		// add the correct tabName to the data and the corret display name
		clonedTabContent.setAttribute('data-tab', tabName);
		clonedTabContent.innerHTML = "TEST";

		this.templateTabContent.nativeElement.parentNode.insertBefore(clonedTabContent, this.templateTabContent.nativeElement);

		// can return the element if desired
		if ( returnElement ) {
			return clonedTabContent;
		}
	}


	/**
	 * updateSaveButton
	 *
	 * checks if the save button should be enabled
	 */
	private updateSaveButton(): void {

		if ( document.querySelector('div.tabcontent[data-tab="' + this.currentTab + '"] form.xsd2html2xml') ) {
			this.saveEnabled = true;
		} else {
			this.saveEnabled = false;
		}

	}

	/**
	 * loadSingleScheme
	 *
	 * loads a single predefined scheme
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
	 * loads multiple schemes to the page that are selected via file input
	 *
	 * @param filesTemplate
	 * @param filesXML
	 */
	private loadMultipleSchemes(filesTemplate: FileList, filesXML: FileList): void {

		console.log('loading schemes:');
		console.log(filesTemplate);

		console.log('adding content from files:');
		console.log(filesXML);

		let formDatas = this.fileListsToFormData(filesTemplate, filesXML);

		let postRequests: MetadataPostRequest[] = [];

		// loop through the FromDatas and create the post requests
		formDatas.forEach((formData: FormData) => {
			postRequests.push(new MetadataPostRequest(this.serverAddress, formData));
		});

		// send the post requests
		this.dataTransferService.postDataMultiple(postRequests).then(
			(results: MetadataServerResponse[]) => {

				// loop through each result and add the content to the page
				results.forEach((result: MetadataServerResponse) => {

					let createdTab = this.addTab(
						this.removeFileExtension(result.scheme),
						this.mapTabNames(
							this.removeFileExtension(result.scheme)
						),
						true
					);

					let createdTabContent = createdTab.tabContent?.contentElement;

					// if there is a content element, display the result html there
					if ( createdTabContent ) {
						createdTabContent.innerHTML = result.html;
						this.removeDoubleLegends(createdTabContent);
					}

				});


				// load the jsfile an execute the code
				this.dataTransferService.getData("assets/xsd2html2xml/js/xsd2html2xml-global.js?" + Date.now(), "text").then(
					((resultFile: any) => {

						results.forEach((result: MetadataServerResponse) => {

							let changedResultFile = resultFile.replaceAll('<<REPLACE>>', result.scheme);
							eval(changedResultFile);

							// dispatch the custom event to trigger the code
							const event = new Event('load' + result.scheme);
							window.dispatchEvent(event);
						});

						// update the save button state
						this.updateSaveButton();

					})
				);
			}
		);
	}


	/**
	 * loadSingleSchemeByFile
	 *
	 * loads a single scheme by file
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


			// check if there is an xml file to fill the inputs
			if (fileXML) {
				formData.append('fileXML', fileXML, fileXML.name);
			} else {
				formData.append('fileXML', '');
			}

			// send the files to the server for parsing
			this.dataTransferService
				.postData('http://localhost:8080/xsdnojs', formData)
				.then((result: any) => {
					console.log('Parsing complete!');

					let currentTabContent: any | null = document.querySelector(
						'div.tabcontent[data-tab="custom"]'
					);

					currentTabContent.innerHTML = this.customizeHTML(result['html']);

					// load the jsfile an execute the code
					this.dataTransferService.getData("assets/xsd2html2xml/js/xsd2html2xml-global.js?" + Date.now(), "text").then(
						((resultFile: any) => {

							resultFile = resultFile.replaceAll('<<REPLACE>>','custom');
							eval(resultFile);

							const event = new Event('ubtuejk');
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
	 * setCustomFileTitle
	 *
	 * sets the title of the custom file input label to the filename
	 *
	 * @param input
	 */
	private setCustomFileTitle(input: HTMLInputElement) {

		// get the parent label and check if it exists
		let parentLabel = input.closest('label.custom-file-input');

		if ( parentLabel ) {

			// search for the span with the title
			let spanTitle = parentLabel.querySelector('.custom-file-input-title');

			if ( spanTitle ) {

				let fileNames = '';

				// loop through all selected files and get the filename
				let files: FileList | null = input.files;

				for ( let i = 0; i < files!.length; i ++ ) {

					fileNames+= files![i].name;

					// add a , if the file is not the last
					if ( i !== ( files!.length -1 ) ) {
						fileNames+= ', ';
					}
				}

				spanTitle.innerHTML = fileNames;
			}
		}
	}


	/**
	 * customizeHTML
	 *
	 * modifies the html for better use
	 *
	 * @param htmlString
	 * @returns
	 */
	private customizeHTML(htmlString: string): string {

		// add novalidate to the form /*TODO*/
		htmlString = htmlString.replace('<form', '<form novalidate');

		return htmlString;
	}


	/**
	 * removeFileExtension
	 *
	 * returns the filename without the file extension
	 *
	 * @param filename
	 * @returns
	 */
	private removeFileExtension(filename: string): string {
		return filename.replace(/(.*)\.(.*?)$/, "$1");
	}


	/**
	 * fileListsToFormData
	 *
	 * converts the FileLists to FormDatas
	 *
	 * @param filesTemplate
	 * @param filesXML
	 * @returns
	 */
	private fileListsToFormData(filesTemplate: FileList, filesXML: FileList): FormData[] {

		let formDatas: FormData[] = [];

		// loop through the template files and search for matching xml files
		for ( let i = 0; i < filesTemplate.length; i++ ) {

			let formData: FormData = new FormData();

			let match = false;

			let currentFilenameTemplate = this.removeFileExtension(filesTemplate.item(i)?.name as string);

			// add the template file to the formData
			formData.append('file', filesTemplate.item(i) as File, filesTemplate.item(i)?.name);

			for ( let j = 0; j < filesXML.length; j++ ) {

				let currentFilenameXML = this.removeFileExtension(filesXML.item(j)?.name as string);

				// if the template and xml match -> add XML to formData
				if ( currentFilenameTemplate === currentFilenameXML ) {

					formData.append('fileXML',  filesXML.item(j) as File,  filesXML.item(j)?.name);

					match = true;

					break;
				}
			}

			// If there was no match -> no XML file in formData
			if ( !match ) {
				formData.append('fileXML', '');
			}

			formDatas.push(formData);
		}

		return formDatas;
	}


	/**
	 * organizeFileLists
	 *
	 * iterates the FileLists and returns a organized array
	 *
	 * @param filesTemplate
	 * @param filesXML
	 * @returns
	 */
	private organizeFileLists(filesTemplate: FileList, filesXML: FileList): any[] {

		let files = [];

		// loop through the template files and search for matching xml files
		for ( let i = 0; i < filesTemplate.length; i++ ) {

			let match = false;

			let currentFilenameTemplate = this.removeFileExtension(filesTemplate.item(i)?.name as string);

			for ( let j = 0; j < filesXML.length; j++ ) {

				let currentFilenameXML = this.removeFileExtension(filesXML.item(j)?.name as string);

				// if the template and xml match -> save
				if ( currentFilenameTemplate === currentFilenameXML ) {

					files.push({
						templateFile: filesTemplate.item(i),
						xmlFile: filesXML.item(j)
					});

					match = true;

					break;
				}
			}

			// if there was no match, set xmlFile to null
			if ( !match ) {

				files.push({
					templateFile: filesTemplate.item(i),
					xmlFile: null
				});
			}
		}

		return files;
	}


	/**
	 * removeDoubleLegends
	 *
	 * removes spans if the previous legend is the exact same text
	 *
	 * @param rootElement
	 */
	private removeDoubleLegends(rootElement: HTMLElement): void {

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
	 * mapTabNames
	 *
	 * maps the tab names to the schemes
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

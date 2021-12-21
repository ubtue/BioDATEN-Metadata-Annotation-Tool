import { LoadingService } from '../../../core/services/loading.service';
import { UpdateNavigationService } from '../../../core/services/update-navigation.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { DataTransferService } from '../../../core/services/data-transfer.service';
import { ElementRef } from '@angular/core';
import { HelperService } from '../../../shared/services/helper.service';

@Component({
	selector: 'app-metadata-annotation-form-test',
	templateUrl: './metadata-annotation-form-test.component.html',
	styleUrls: ['./metadata-annotation-form-test.component.scss'],
})

export class MetadataAnnotationFormTestComponent implements OnInit {

	serverAddress: string = 'http://localhost:8080/xsd';

	currentTab: string = '';
	saveEnabled: boolean = false;

	@ViewChild('formResultDatacite') formResultDatacite!: ElementRef;
	@ViewChild('formResultPremis') formResultPremis!: ElementRef;
	@ViewChild('formResultBiodatenMinimal')
	formResultBiodatenMinimal!: ElementRef;
	@ViewChild('formResultCustom') formResultCustom!: ElementRef;
	@ViewChild('inputFileSingleTemplate') inputFileSingleTemplate!: ElementRef;
	@ViewChild('inputFileSingleXML') inputFileSingleXML!: ElementRef;

	constructor(private dataTransferService: DataTransferService,
				private updateNavigationService: UpdateNavigationService,
				public loadingService: LoadingService,
				private helperService: HelperService) {}

	ngOnInit(): void {
		this.currentTab = 'datacite';

		this.updateNavigationService.updateCurrentView("Metadata for resource:", "TEST");
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
		this.updateNavigationService.updateCurrentView("Metadata for resource:", "TEST");
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
			console.log((window as any).htmlToXML(document.querySelector('div.tabcontent[data-tab="' + this.currentTab + '"] form.xsd2html2xml')));
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

		let fileTemplate = this.inputFileSingleTemplate.nativeElement
			.files[0] as File;

		let fileXML = this.inputFileSingleXML.nativeElement.files[0] as File;

		this.loadSingleSchemaByFile(fileTemplate, fileXML);

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
	 * loadSingleSchema
	 *
	 * loads a single predefined schema
	 *
	 * @param schema
	 */
	private loadSingleSchema(schema: string): void {

		console.log('Getting form data from service for schema ' + schema + '...');

		// get the selected schema from the server
		this.dataTransferService
			.getData('http://localhost:8080/xsdnojs/' + schema, 'json')
			.then((result: any) => {
				console.log('Result from getting data for ' + schema);

				let resultElement;

				switch ( schema ) {

					case 'biodatenMinimal':
						resultElement = this.formResultBiodatenMinimal;
						break;

					case 'premis':
						resultElement = this.formResultPremis;
						break;

					case 'datacite':
						resultElement = this.formResultDatacite;
						break;

					default:
						resultElement = this.formResultCustom;
				}



				resultElement.nativeElement.innerHTML = this.customizeHTML(result['html']);

				this.removeDoubleLegends(resultElement.nativeElement);

				// load the js file and execute the code
				this.dataTransferService.getData("assets/xsd2html2xml/js/xsd2html2xml-global.js?" + Date.now(), "text").then(
					((resultFile: any) => {

						resultFile = resultFile.replaceAll('<<REPLACE_FULL>>', schema).replaceAll('<<REPLACE>>', this.helperService.removeFileExtension(schema));
						eval(resultFile);

						const event = new Event('load' + this.helperService.removeFileExtension(schema));
						window.dispatchEvent(event);

						// update the save button state
						this.updateSaveButton();

					})
				);
			});
	}


	/**
	 * loadSingleSchemaByFile
	 *
	 * loads a single schema by file
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

							resultFile = resultFile.replaceAll('<<REPLACE_FULL>>', fileTemplate.name).replaceAll('<<REPLACE>>', this.helperService.removeFileExtension(fileTemplate.name));
							eval(resultFile);

							// Dispatch the custom event to trigger the code
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

				// remove C:\fakepath\ from filename
				let filename = input.value.replace(/C:\\fakepath\\/, '');

				spanTitle.innerHTML = filename;
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
	 * debug
	 * @param input
	 */
	debug(input: any): void {
		console.log(input.closest('label').querySelector('span.custom-file-input-title'));
	}
}

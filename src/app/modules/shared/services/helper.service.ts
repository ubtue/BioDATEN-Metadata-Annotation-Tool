import { MetadataPostRequest } from 'src/app/modules/shared/models/metadata-post-request.model';
import { HttpHeaders } from '@angular/common/http';
import { DataTransferService } from './../../core/services/data-transfer.service';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})

/**
 * HelperService
 *
 * Helper functions
 */
export class HelperService {

	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService,
				private dataTransferService: DataTransferService) {}


	/**
	 * removeFileExtension
	 *
	 * Returns the filename without the file extension
	 *
	 * @param filename
	 * @returns
	 */
	 removeFileExtension(filename: string): string {
		return filename.replace(/(.*)\.(.*?)$/, "$1");
	}


	/**
	 * fileListsToFormDataTemplate
	 *
	 * Converts the FileLists to FormDatas for template files
	 *
	 * @param filesTemplate
	 * @param filesXML
	 * @returns
	 */
	 fileListsToFormDataTemplate(filesTemplate: FileList, filesXML?: FileList): FormData[] {

		let formDatas: FormData[] = [];

		// Loop through the template files and search for matching xml files
		for ( let i = 0; i < filesTemplate.length; i++ ) {

			let formData: FormData = new FormData();

			let match = false;

			let currentFilenameTemplate = this.removeFileExtension(filesTemplate.item(i)?.name as string);

			// Add the template file to the formData
			formData.append('file', filesTemplate.item(i) as File, filesTemplate.item(i)?.name);

			if ( filesXML && filesXML.length > 0 ) {

				for ( let j = 0; j < filesXML.length; j++ ) {

					let currentFilenameXML = this.removeFileExtension(filesXML.item(j)?.name as string);

					// If the template and xml match -> add XML to formData
					if ( currentFilenameTemplate === currentFilenameXML ) {

						formData.append('fileXML',  filesXML.item(j) as File,  filesXML.item(j)?.name);

						match = true;

						break;
					}
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
	 * fileListsToFormDataXML
	 *
	 * Converts the FileLists to FormDatas for xml files
	 *
	 * @param filesXML
	 * @returns
	 */
	 fileListsToFormDataXML(filesXML: FileList): FormData[] {

		let formDatas: FormData[] = [];

		// Loop through the template files and search for matching xml files
		for ( let i = 0; i < filesXML.length; i++ ) {

			let formData: FormData = new FormData();

			// Add the template file to the formData
			formData.append('fileXML', filesXML.item(i) as File, filesXML.item(i)?.name);

			formDatas.push(formData);
		}

		return formDatas;
	}


	/**
	 * organizeFileLists
	 *
	 * Iterates the FileLists and returns a organized array
	 *
	 * @param filesTemplate
	 * @param filesXML
	 * @returns
	 */
	organizeFileLists(filesTemplate: FileList, filesXML: FileList): any[] {

		let files = [];

		// Loop through the template files and search for matching xml files
		for ( let i = 0; i < filesTemplate.length; i++ ) {

			let match = false;

			let currentFilenameTemplate = this.removeFileExtension(filesTemplate.item(i)?.name as string);

			for ( let j = 0; j < filesXML.length; j++ ) {

				let currentFilenameXML = this.removeFileExtension(filesXML.item(j)?.name as string);

				// If the template and xml match -> save
				if ( currentFilenameTemplate === currentFilenameXML ) {

					files.push({
						templateFile: filesTemplate.item(i),
						xmlFile: filesXML.item(j)
					});

					match = true;

					break;
				}
			}

			// If there was no match, set xmlFile to null
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
	 * addXMLStructure
	 *
	 * Adds the XML structure to a string
	 *
	 * @param xmlData
	 * @returns
	 */
	addXMLStructure(xmlData: string): string {

		return String.fromCharCode(60)
			.concat('?xml version="1.0"?')
			.concat(String.fromCharCode(62))
			.concat(String.fromCharCode(60))
			.concat('schemas')
			.concat(String.fromCharCode(62))
			.concat(xmlData)
			.concat(String.fromCharCode(60))
			.concat(String.fromCharCode(47))
			.concat('schemas')
			.concat(String.fromCharCode(62))
	}

	/**
	 * sort
	 *
	 * Sorting function
	 *
	 * @param valuePath
	 * @param array
	 * @returns
	 */
	sort(valuePath: string, array: any) {
		let path = valuePath.split('.')

		return array.sort((a: any, b: any) => {
			let aSort = getValue(a, path).toLowerCase(), bSort = getValue(b, path).toLowerCase();
			if (aSort < bSort) //sort string ascending
				return -1;
			if (aSort > bSort)
				return 1;
			return 0; //default return value (no sorting)
		});

		function getValue(obj: any, path: any) {
			path.forEach((path: any) => obj = obj[path])
			return obj;
		}
	}


	/**
	 * sortDescending
	 *
	 * Sorting function (descending)
	 *
	 * @param valuePath
	 * @param array
	 * @returns
	 */
	sortDescending(valuePath: string, array: any) {
		let path = valuePath.split('.')

		return array.sort((a: any, b: any) => {
			let aSort = getValue(a, path).toLowerCase(), bSort = getValue(b, path).toLowerCase();
			if (aSort > bSort) //sort string descending
				return -1;
			if (aSort < bSort)
				return 1;
			return 0; //default return value (no sorting)
		});

		function getValue(obj: any, path: any) {
			path.forEach((path: any) => obj = obj[path])
			return obj;
		}
	}

	/**
	 * sortNumbers
	 *
	 * Sorting function for numbers
	 *
	 * @param valuePath
	 * @param array
	 * @returns
	 */
	sortNumbers(valuePath: string, array: any) {
		let path = valuePath.split('.')

		return array.sort((a: any, b: any) => {
			let aSort = getValue(a, path), bSort = getValue(b, path);
			if (aSort < bSort) //sort string descending
				return -1;
			if (aSort > bSort)
				return 1;
			return 0; //default return value (no sorting)
		});

		function getValue(obj: any, path: any) {
			path.forEach((path: any) => obj = obj[path])
			return obj;
		}
	}


	/**
	 * sortNumbersDescending
	 *
	 * Sorting function for numbers (descending)
	 *
	 * @param valuePath
	 * @param array
	 * @returns
	 */
	sortNumbersDescending(valuePath: string, array: any) {
		let path = valuePath.split('.')

		return array.sort((a: any, b: any) => {
			let aSort = getValue(a, path), bSort = getValue(b, path);
			if (aSort > bSort) //sort string descending
				return -1;
			if (aSort < bSort)
				return 1;
			return 0; //default return value (no sorting)
		});

		function getValue(obj: any, path: any) {
			path.forEach((path: any) => obj = obj[path])
			return obj;
		}
	}


	/**
	 * convertXmlToMets
	 *
	 * Converts a system created xml string to a mets xml string with the help of the backend (XSLT-script based)
	 *
	 * @param xmlString
	 * @returns
	 */
	convertXmlToMets(xmlString: string): Promise<string> {

		let postRequest: MetadataPostRequest;

		// Take the first and only entry in formData and make the post request
		postRequest = (new MetadataPostRequest(this.settingsService.metadataAnnotationFormServerAddress + 'mets', xmlString));

		return this.dataTransferService.postData(postRequest.url, postRequest.body, {responseType: 'text'}).then(
			(metsString: string) => {
				return metsString;
			}
		);
	}


	/**
	 * sendDataToFdat
	 *
	 * Sends the xml data to FDAT
	 *
	 * @param xmlString
	 * @param fdatToken
	 * @returns
	 */
	sendDataToFdat(xmlString: string, fdatToken: string): Promise<string> {

		let postRequest: MetadataPostRequest;

		// Create the params JSON
		let params = {
			'xml': xmlString,
			'fdatKey': fdatToken
		}

		// Create the post request
		postRequest = (new MetadataPostRequest(this.settingsService.metadataAnnotationFormServerAddress + 'send-fdat', params));

		// Send the post request to the backend
		return this.dataTransferService.postData(postRequest.url, postRequest.body, {responseType: 'text'}).then(
			(fdatJson: string) => {
				return fdatJson;
			}
		);
	}


	/**
	 * loadScript
	 *
	 * Loads a script to the header. Promise resolves after script is fully loaded
	 *
	 * @param src
	 * @returns
	 */
	loadScript(src: string): Promise<string> {

		return new Promise((resolve, reject) => {

			// Load script
			let script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = src;

			script.onload = () => {
				resolve(src);
			};

			script.onerror = (error: any) => resolve(src);
			document.getElementsByTagName('head')[0].appendChild(script);

		});
	}
}

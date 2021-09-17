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
	constructor() {}


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
			.concat('schemes')
			.concat(String.fromCharCode(62))
			.concat(xmlData)
			.concat(String.fromCharCode(60))
			.concat(String.fromCharCode(47))
			.concat('schemes')
			.concat(String.fromCharCode(62))
	}
}

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
	 * fileListsToFormData
	 *
	 * Converts the FileLists to FormDatas
	 *
	 * @param filesTemplate
	 * @param filesXML
	 * @returns
	 */
	 fileListsToFormData(filesTemplate: FileList, filesXML: FileList): FormData[] {

		let formDatas: FormData[] = [];

		// Loop through the template files and search for matching xml files
		for ( let i = 0; i < filesTemplate.length; i++ ) {

			let formData: FormData = new FormData();

			let match = false;

			let currentFilenameTemplate = this.removeFileExtension(filesTemplate.item(i)?.name as string);

			// Add the template file to the formData
			formData.append('file', filesTemplate.item(i) as File, filesTemplate.item(i)?.name);

			for ( let j = 0; j < filesXML.length; j++ ) {

				let currentFilenameXML = this.removeFileExtension(filesXML.item(j)?.name as string);

				// If the template and xml match -> add XML to formData
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
}

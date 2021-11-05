import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class FileService {

	/**
	 * constructor
	 */
	constructor() {}

	/**
	 * readFileContent
	 *
	 * Reads and returns the content of a file
	 *
	 * @param file
	 * @returns
	 */
	readFileContent(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!file) {
                resolve('');
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                const text = reader.result!.toString();
                resolve(text);

            };

            reader.readAsText(file);
        });
    }


	/**
	 * getFilePath
	 *
	 * Returns the filepath of a file
	 *
	 * @param file
	 * @returns
	 */
	getFilePath(file: File): Promise<any> {

		return new Promise<any>((resolve, reject) => {
            if (!file) {
                resolve('');
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                const filePath = e.target;
                resolve(filePath);

            };

            reader.readAsText(file);
        });
	}
}

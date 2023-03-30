import { AutocompleteData } from './../models/autocomplete-data.model';
import { DataTransferService } from './../../core/services/data-transfer.service';
import { Injectable } from '@angular/core';


@Injectable({
	providedIn: 'root',
})
export class BioportalService {

	constructor(private dataTransferService: DataTransferService) {

	}


	/**
	 * getData
	 *
	 * Gets the autocomplete data from the bioportal server
	 *
	 * @param url
	 * @returns
	 */
	getData(url: string): Promise<AutocompleteData[]> {

		return this.dataTransferService.getData(url, "text", true).then(
			(data: any) => {

				// Check if there is any server response
				if ( data ) {

					// Return the parsed data
					return this.parseData(data);

				} else {
					return [];
				}
			}
		);
	}


	/**
	 * parseData
	 *
	 * Parses the string from the bioportal search to a usable format
	 * Important indexes after splitting the string:
	 * 0: Label
	 * 3: Version (not always - defaults to ontology name)
	 * 4: Identifiert (uri)
	 * 9: Description
	 *
	 * @param data
	 * @returns
	 */
	parseData(data: string): AutocompleteData[] {

		let parsed: AutocompleteData[] = [];
        let rows = data.split("~!~");

        for ( let i = 0; i < rows.length; i++ ) {

			let row = rows[i].trim();

			if ( row ) {
				let splittedData = row.split('|');

				// The data has to have at least 10 entries
				if ( splittedData.length >= 10 ) {

					// The data from the server is a lot. We just need the identifier (uri), the label and the description
					// Label is at index 0
					let label = splittedData[0]

					// Ontology Version sometimes is at 3
					let version = splittedData[3];

					// Identifier is at index 4
					let identifier = splittedData[4];

					// Description is at index 9
					let description = decodeURIComponent((splittedData[9] + '').replace(/\+/g, ' '));

					// Create a autocomplete data item and push it to the parsed array
					let item: AutocompleteData = {
						identifier: identifier,
						label: label,
						description: description,
						version: version
					};

					parsed.push(item);
				}
			}
        }

        return parsed;
	}
}

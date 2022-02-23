import { MetadataUserResource } from './../models/metadata-user-resource.model';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { DataTransferService } from './../../core/services/data-transfer.service';
import { MetadataUserResourceServerResponse } from './../models/metadata-user-resource-server-response.model';
import { Injectable } from '@angular/core';



@Injectable({
	providedIn: 'root',
})
export class UserResourceService {


	/**
	 * constructor
	 */
	constructor(private dataTransferService: DataTransferService,
				private settingsService: SettingsService) {
	}


	/**
	 * getAllUserResourcesFromServer
	 *
	 * Gets all user resources from the server
	 *
	 * @returns
	 */
	 getAllUserResourcesFromServer(): Promise<MetadataUserResourceServerResponse[]> {

		// Get the user resources from the server
		return this.dataTransferService.getData(this.settingsService.userResourceServerAddress).then(

			(result: MetadataUserResourceServerResponse[]) => {

				return result;
			}
		)
	}


	/**
	 * parseUserResourcesServerResponseToUserResources
	 *
	 * Parses the user resource server response to a local format
	 *
	 * @param metadataResourcesServerResponse
	 * @returns
	 */
	parseUserResourcesServerResponseToUserResources(metadataResourcesServerResponse: MetadataUserResourceServerResponse[]): MetadataUserResource[] {

		let result: MetadataUserResource[] = [];

		// Check if data has entries
		if ( metadataResourcesServerResponse.length > 0 ) {

			// Loop through the data and parse every entry
			for ( let i = 0; i < metadataResourcesServerResponse.length; i++ ) {

				let currentServerResource = metadataResourcesServerResponse[i];

				// Convert the date
				let date = new Date(currentServerResource.lastChange);

				let lastChange = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();

				// Status
				let status = '';
				let statusKey = '';

				switch ( currentServerResource.status ) {

					case 0:
						status = 'new';
						statusKey = 'a_new';
						break;

					case 1:
						status = 'In progress';
						statusKey = 'k_progress';
						break;

					case 2:
						status = 'Ready';
						statusKey = 't_ready';
						break;

					case 3:
						status = 'Finished';
						statusKey = 'z_finished';
						break;
				}

				// Add new Resource to the result
				let metadataUserResource = new MetadataUserResource(
					currentServerResource.position,
					currentServerResource.id,
					currentServerResource.title,
					lastChange,
					status,
					statusKey
				);

				result.push(metadataUserResource);
			}
		}

		return result;
	}
}

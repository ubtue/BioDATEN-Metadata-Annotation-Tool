import { Injectable } from "@angular/core";
import { SettingsService } from "./settings.service";
import { DataTransferService } from "../../core/services/data-transfer.service";
import { UserInformation } from "../models/user-information.model";
import { HttpHeaders } from "@angular/common/http";


@Injectable({
	providedIn: 'root',
})
export class UserInformationService {

	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService,
				private dataTransferService: DataTransferService) {

				}


	/**
	 * getUserInformationByUserId
	 *
	 * Gets the user information for a specific user id from the server
	 *
	 * @param userId
	 * @returns
	 */
	getUserInformationByUserId(userId: string): Promise<UserInformation> {

		return this.dataTransferService.getData(this.settingsService.userInformationServerAdress + 'user-id/' + userId).then(
			(userInformation: UserInformation) => {
				return userInformation;
			}
		);
	}


	/**
	 * addNewUserInformation
	 *
	 * Adds new user information to the server
	 *
	 * @param userId
	 * @returns
	 */
	addNewUserInformation(userId: string): Promise<any> {

		// Create params string
		let params = {
			'userId': userId,
		};

		let paramsString = JSON.stringify(params);

		// Create httpOpts (headers)
		let httpOpts = {
			headers: new HttpHeaders().set('Accept', '*/*').set('Content-Type', 'application/json')
		};

		// Send POST-Request
		return this.dataTransferService.postData(this.settingsService.userInformationServerAdress, paramsString, httpOpts);
	}


	/**
	 * updateUserInformation
	 *
	 * Updates the user information in the database
	 *
	 * @param userInformationObj
	 * @param userId
	 * @param fdatKey
	 * @returns
	 */
	updateUserInformation(userInformationObj: UserInformation, userId: string, fdatKey: string): Promise<any> {

		// Create params string
		let params = {
			'id': userInformationObj.id,
			'userId': userId,
			'fdatKey': fdatKey
		};

		let paramsString = JSON.stringify(params);

		// Create httpOpts (headers)
		let httpOpts = {
			headers: new HttpHeaders().set('Accept', '*/*').set('Content-Type', 'application/json')
		};


		// Send PUT-Request
		return this.dataTransferService.putData(this.settingsService.userInformationServerAdress, paramsString, httpOpts);
	}


	/**
	 * deleteUserInformation
	 *
	 * Deletes the user information in the database
	 *
	 * @param schemaObj
	 */
	deleteUserInformation(userInformationObj: UserInformation): Promise<any> {
		return this.dataTransferService.deleteData(this.settingsService.userInformationServerAdress + userInformationObj.id);
	}


	/**
	 * handleUserInformationOnLoad
	 *
	 * Handles the user information on load of the page.
	 * It checks if there is any user information for the userId given. If yes, nothing happens.
	 * If there is no user information it creates a new user information entry for the user id with all other fields empty
	 *
	 * @param userId
	 */
	handleUserInformationOnLoad(userId: string): void {

		// Check if there is a user information entry for the current user
		this.getUserInformationByUserId(userId).then(
			(userInformation: UserInformation) => {

				// If there is no user information, create a new one with the data of the current user
				if ( !userInformation ) {

					// Add new user information
					this.addNewUserInformation(userId);

				} else {
					if ( this.settingsService.enableConsoleLogs ) {
						console.log('Fetched user information:');
						console.log(userInformation);
					}
				}
			}
		)
	}
}

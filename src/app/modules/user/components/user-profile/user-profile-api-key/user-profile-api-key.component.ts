import { UserDataResult, OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UpdateNavigationService } from 'src/app/modules/core/services/update-navigation.service';
import { OidcService } from 'src/app/modules/core/services/oidc.service';
import { UserInformationService } from 'src/app/modules/shared/services/user-information.service';
import { UserInformation } from 'src/app/modules/shared/models/user-information.model';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { AlertButton } from 'src/app/modules/shared/models/alert-button.model';

@Component({
	selector: 'app-user-profile-api-key',
	templateUrl: './user-profile-api-key.component.html',
	styleUrls: ['./user-profile-api-key.component.scss']
})
export class UserProfileApiKeyComponent implements OnInit {

	userData$: Observable<UserDataResult> = {} as any;

	userInformation: UserInformation = {} as any;

	fdatKey: string = "";


	/**
	 * constructor
	 */
	constructor(private updateNavigationService: UpdateNavigationService,
				public oidcSecurityService: OidcSecurityService,
				private oidcService: OidcService,
				private userInformationService: UserInformationService,
				private settingsService: SettingsService,
				private alertService: AlertService
				) {}


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {
		this.updateNavigationService.updateCurrentView("User profile:", "Tokens");

		this.userData$ = this.oidcSecurityService.userData$;

		this.userData$.subscribe(userData => {

			// Get user id from the userData
			let userId = this.oidcService.getUserIdFromUserData(userData);

			// Get the user information
			this.userInformationService.getUserInformationByUserId(userId).then(
				(userInformation: UserInformation) => {

					// Save the user informaton
					this.userInformation = userInformation;

					// Save the fdatKey
					this.fdatKey = userInformation.fdatKey;
				}
			);
		});
	}

	/**
	 * onClickSaveAPIKeys
	 *
	 * Onclick handler for save button
	 */
	onClickSaveAPIKeys(): void {
		this.handleSaveAPIKeys();
	}


	/**
	 * handleSaveAPIKeys
	 *
	 * Asks the user if they want to overwrite their current API keys
	 */
	private handleSaveAPIKeys(): void {

		// Ask the user if they are sure they want to continue
		let buttons: AlertButton[] = [];

		// Confirm button
		buttons.push(
			new AlertButton(
				'Confirm',
				() => {
					this.saveAPIKeys();
					this.alertService.hideAlert();
				}
			)
		);

		// Cancel button
		buttons.push(
			new AlertButton(
				'Cancel',
				() => {
					this.alertService.hideAlert();
				}
			)
		);

		// Show alert
		this.alertService.showAlert(
			'Overwrite API keys',
			'Are you sure you want overwrite your tokens?',
			buttons
		);
	}


	/**
	 * saveAPIKeys
	 *
	 * Save the API keys to the server
	 */
	private saveAPIKeys(): void {

		if ( this.settingsService.enableConsoleLogs ) {
			console.log('Saving the following FDAT token:');
			console.log(this.fdatKey);
		}

		// Check if there is a uuid in the user infromation and update the user information entry in the databse
		if ( this.userInformation && this.userInformation.id ) {
			this.userInformationService.updateUserInformation(this.userInformation, this.userInformation.userId, this.fdatKey);
		}

	}
}

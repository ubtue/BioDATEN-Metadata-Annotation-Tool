import { BehaviorSubject } from 'rxjs';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { LoadingService } from 'src/app/modules/core/services/loading.service';
import { Injectable } from '@angular/core';
import { LogLevel, OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
	providedIn: 'root'
})
export class OidcService {

	static readonly METADATA_ANNOTATION_ADMIN_ROLE: string = 'metadata-annotation-admin';

	_userIsAdmin: boolean = false;
	_userGroups: string[] = [];

	_isAuthenticated: boolean = false;
	_userData: any;
	_accessToken: string = '';
	_idToken: string = '';

	private isUserAdmin$$ = new BehaviorSubject<boolean>(false);
	isUserAdmin$ = this.isUserAdmin$$.asObservable();


	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService,
				public oidcSecurityService: OidcSecurityService) {

					console.log(window.location.origin + '/metadata-annotation/#/user/metadata-resources');
	}


	/**
	 * customLogin
	 *
	 * Custom login function
	 */
	customLogin(): void {
		this.oidcSecurityService.authorize(
			'',
			{
				/*TODO: CORRECT REDIRECT? */
				redirectUrl: window.location.origin + '/metadata-annotation/#/user/metadata-resources'
			}
		);
	}


	/**
	 * customLogout
	 *
	 * Custom logout function
	 */
	customLogout(): void {

		// Logoff
		this.oidcSecurityService.logoff();
	}


	// /**
	//  * printLoginInformation
	//  *
	//  * Prints the login information to the console
	//  */
	// printLoginInformation(): void {

	// 	if ( this.userInformation === null ) {
	// 		this.loadUserProfile().then(
	// 			(userData: KeycloakProfile) => {

	// 				if ( this.settingsService.enableConsoleLogs ) {
	// 					console.log('userData:');
	// 					console.log(userData);
	// 				}
	// 			}
	// 		);
	// 	} else {

	// 		this.updateLoginInformation().then(
	// 			() => {

	// 				if ( this.settingsService.enableConsoleLogs ) {
	// 					console.log('userData:');
	// 					console.log(this.userInformation);
	// 				}

	// 				if ( this.userGroups !== null && this.userGroups.length > 0 ) {
	// 					if ( this.settingsService.enableConsoleLogs ) {
	// 						console.log('userGroups:');
	// 						console.log(this.userGroups);
	// 					}
	// 				}
	// 			}
	// 		);
	// 	}
	// }


	// /**
	//  * updateLoginInformation
	//  *
	//  * Gets the current user information and saves it
	//  */
	// updateLoginInformation(): Promise<any> {

	// 	return this.isLoggedIn().then(
	// 		(isUserLoggedIn: boolean) => {

	// 			// After init, check if the user is logged in and safe the user profile
	// 			if (isUserLoggedIn) {

	// 				return this.loadUserProfile().then(
	// 					(userProfile: KeycloakProfile) => {
	// 						this.userInformation = userProfile;

	// 						// Check if user is admin
	// 						if ( this.getUserRoles().includes(KeycloakService.METADATA_ANNOTATION_ADMIN_ROLE) ) {
	// 							this.userIsAdmin = true;
	// 							this.isUserAdmin$$.next(true);
	// 						} else {
	// 							this.userIsAdmin = false;
	// 							this.isUserAdmin$$.next(false);
	// 						}

	// 						// Get the usergroups
	// 						return this.getKeycloakInstance().loadUserInfo().then(
	// 							(userInfo: any) => {
	// 								if ( userInfo && userInfo.usergroups && userInfo.usergroups.length > 0 ) {
	// 									this.userGroups = this.parseUserGroups(userInfo.usergroups);
	// 									return;
	// 								}
	// 							}
	// 						)
	// 					}
	// 				);

	// 			} else {
	// 				this.userInformation = null as any;
	// 				this.userGroups = [];
	// 				return;
	// 			}
	// 		}
	// 	);
	// }


	/**
	 * parseUserGroups
	 *
	 * Pareses the usergroups strings
	 *
	 * @param userGroups
	 * @returns
	 */
	parseUserGroups(userGroups: string[]): string[] {

		if ( userGroups.length > 0 ) {

			for ( let i = 0; i < userGroups.length; i++ ) {

				if ( userGroups[i].indexOf('/', 0) !== -1 ) {
					userGroups[i] = userGroups[i].replace('/', '');
				}
			}

			return userGroups;

		} else {
			return [];
		}
	}


	/**
	 * parseAccessToken
	 *
	 * Parses the acces token (jwt)
	 *
	 * @param token
	 * @returns
	 */
	parseAccessToken(token: string): any {

		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		return JSON.parse(jsonPayload);
	}


	/**
	 * getRealmRolesFromAccessToken
	 *
	 * Gets the realm roles from the access token
	 *
	 * @param accessToken
	 * @returns
	 */
	getRealmRolesFromAccessToken(accessToken: any): string[] {

		let roles: string[] = [];

		// Check if client roles exist
		if ( accessToken && accessToken.realm_access && accessToken.realm_access.roles && accessToken.realm_access.roles.length > 0 ) {
			roles = accessToken.realm_access.roles;
		}

		return roles;
	}


	/**
	 * getClientRolesFromAccessToken
	 *
	 * Gets the client roles from the access token
	 *
	 * @param accessToken
	 * @returns
	 */
	 getClientRolesFromAccessToken(accessToken: any): string[] {

		let roles: string[] = [];

		// Check if client roles exist
		if ( accessToken && accessToken.client_role && accessToken.client_role.length > 0 ) {
			roles = accessToken.client_role;
		}

		return roles;
	}


	/**
	 * setAdminState
	 *
	 * Sets the current admin state
	 *
	 * @param isAdmin
	 */
	setAdminState(isAdmin: boolean): void {
		this.isUserAdmin$$.next(isAdmin);
	}


	/**
	 * getUserIdFromUserData
	 *
	 * Gets the user ID from the user data object
	 *
	 * @param userData
	 * @returns
	 */
	getUserIdFromUserData(userData: any): string {

		let userId: string = '';

		// Check if the user has a orcid ID -> use orcid ID as user ID
		if ( userData.userData.orcid ) {
			userId = userData.userData.orcid;

			if ( this.settingsService.enableConsoleLogs ) {
				console.log('User ID is ORCID ID:');
			}

		} else {

			// If user has no orcid ID, use the sub (LifeScience AAI ID)
			userId = userData.userData.sub;

			if ( this.settingsService.enableConsoleLogs ) {
				console.log('User ID is LS AAI ID:');
			}
		}

		if ( this.settingsService.enableConsoleLogs ) {
			console.log(userId);
		}

		return userId;
	}


	/******************************************************************
							GETTERS AND SETTERS
	*******************************************************************/


	/**
	 * Getter userIsAdmin
	 */
	 get userIsAdmin(): boolean {
		return this._userIsAdmin;
	}


	/**
	 * Setter userIsAdmin
	 */
	set userIsAdmin(userIsAdmin: boolean) {
		this._userIsAdmin = userIsAdmin;
	}


	/**
	 * Getter isAuthenticated
	 */
	 get isAuthenticated(): boolean {
		return this._isAuthenticated;
	}


	/**
	 * Setter isAuthenticated
	 */
	set isAuthenticated(isAuthenticated: boolean) {
		this._isAuthenticated = isAuthenticated;
	}

	/**
	 * Getter userData
	 */
	 get userData(): any {
		return this._userData;
	}


	/**
	 * Setter userData
	 */
	set userData(userData: any) {
		this._userData = userData;
	}


	/**
	 * Getter accessToken
	 */
	 get accessToken(): string {
		return this._accessToken;
	}


	/**
	 * Setter accessToken
	 */
	set accessToken(accessToken: string) {
		this._accessToken = accessToken;
	}


	/**
	 * Getter idToken
	 */
	 get idToken(): string {
		return this._idToken;
	}


	/**
	 * Setter idToken
	 */
	set idToken(idToken: string) {
		this._idToken = idToken;
	}


	/**
	 * Getter userGroups
	 */
	 get userGroups(): string[] {
		return this._userGroups;
	}


	/**
	 * Setter userGroups
	 */
	set userGroups(userGroups: string[]) {
		this._userGroups = userGroups;
	}
}

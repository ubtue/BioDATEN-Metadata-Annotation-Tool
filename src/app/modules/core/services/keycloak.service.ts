import { KeycloakService as AngularKeycloakService} from 'keycloak-angular';
import { Injectable } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
	providedIn: 'root'
})
export class KeycloakService extends AngularKeycloakService {

	_authServerAddress: string = "https://portal.biodaten.info/auth";
	_keycloakRealm:string = "biodaten";
	_keycloakClientId: string = "annotation-biodaten";
	_logoutAddress: string = "https://portal.biodaten.info/logout";

	_userInformation: KeycloakProfile = null as any;

	constructor() {
		super();
	}


	/**
	 * biodatenLogout
	 *
	 * Redirects to the logout of the BioDATEN Hub
	 */
	biodatenLogout(): void {
		window.location.href = this.logoutAddress;
	}


	/**
	 * customLogin
	 *
	 * Custom login function
	 */
	customLogin(): void {
		this.login();
	}


	/**
	 * customLogout
	 *
	 * Custom logout function
	 */
	customLogout(): void {

		// Remove the stored user information
		this.userInformation = null as any;

		// Create the logout url and redirect to it
		window.location.href = this.getKeycloakInstance().createLogoutUrl();
	}


	/**
	 * printLoginInformation
	 *
	 * Prints the login information to the console
	 */
	printLoginInformation(): void {
		this.loadUserProfile().then(
			(userData: any) => {
				console.log('userData:');
				console.log(userData);
			}
		);
	}

	/******************************************************************
							GETTERS AND SETTERS
	*******************************************************************/

	/**
	 * Getter authServerAddress
	 */
	get authServerAddress(): string {
		return this._authServerAddress;
	}

	/**
	 * Setter authServerAddress
	 */
	set authServerAddress(authServerAddress: string) {
		this._authServerAddress = authServerAddress;
	}

	/**
	 * Getter keycloakRealm
	 */
	 get keycloakRealm(): string {
		return this._keycloakRealm;
	}

	/**
	 * Setter keycloakRealm
	 */
	set keycloakRealm(keycloakRealm: string) {
		this._keycloakRealm = keycloakRealm;
	}

	/**
	 * Getter keycloakRealm
	 */
	 get keycloakClientId(): string {
		return this._keycloakClientId;
	}

	/**
	 * Setter keycloakClientId
	 */
	set keycloakClientId(keycloakClientId: string) {
		this._keycloakClientId = keycloakClientId;
	}

	/**
	 * Getter logoutAddress
	 */
	 get logoutAddress(): string {
		return this._logoutAddress;
	}


	/**
	 * Setter logoutAddress
	 */
	set logoutAddress(logoutAddress: string) {
		this._logoutAddress = logoutAddress;
	}

	/**
	 * Getter userInformation
	 */
	get userInformation(): KeycloakProfile {
		return this._userInformation;
	}


	/**
	 * Setter userInformation
	 */
	set userInformation(userInformation: KeycloakProfile) {
		this._userInformation = userInformation;
	}

}
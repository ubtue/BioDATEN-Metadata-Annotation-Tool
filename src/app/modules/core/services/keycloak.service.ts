// import { BehaviorSubject } from 'rxjs';
// import { SettingsService } from 'src/app/modules/shared/services/settings.service';
// import { LoadingService } from 'src/app/modules/core/services/loading.service';
// import { KeycloakService as AngularKeycloakService} from 'keycloak-angular';
// import { Injectable } from '@angular/core';
// import { KeycloakProfile } from 'keycloak-js';

// @Injectable({
// 	providedIn: 'root'
// })
// export class KeycloakService extends AngularKeycloakService {

// 	static readonly METADATA_ANNOTATION_ADMIN_ROLE: string = 'metadata-annotation-admin';

// 	_authServerAddress: string = "https://portal.biodaten.info/auth";
// 	_keycloakRealm:string = "biodaten";
// 	_keycloakClientId: string = "annotation-biodaten";
// 	_logoutAddress: string = "https://portal.biodaten.info/logout";

// 	_userIsAdmin: boolean = false;

// 	_userInformation: KeycloakProfile = null as any;
// 	_userGroups: string[] = [];

// 	private isUserAdmin$$ = new BehaviorSubject<boolean>(false);
// 	isUserAdmin$ = this.isUserAdmin$$.asObservable();


// 	/**
// 	 * constructor
// 	 */
// 	constructor(private settingsService: SettingsService) {
// 		super();
// 	}


// 	/**
// 	 * biodatenLogout
// 	 *
// 	 * Redirects to the logout of the BioDATEN Hub
// 	 */
// 	biodatenLogout(): void {
// 		window.location.href = this.logoutAddress;
// 	}


// 	/**
// 	 * customLogin
// 	 *
// 	 * Custom login function
// 	 */
// 	customLogin(): void {
// 		this.login(
// 			{
// 				/*TODO: CORRECT REDIRECT? */
// 				redirectUri: window.location.origin + '/metadata-annotation/#/user/metadata-resources'
// 			}
// 		);
// 	}


// 	/**
// 	 * customLogout
// 	 *
// 	 * Custom logout function
// 	 */
// 	customLogout(): void {

// 		// Remove the stored user information
// 		this.userInformation = null as any;

// 		// Create the logout url and redirect to it
// 		window.location.href = this.getKeycloakInstance().createLogoutUrl(
// 			{
// 				/*TODO: CORRECT REDIRECT? */
// 				redirectUri: window.location.origin + '/metadata-annotation/'
// 			}
// 		);
// 	}


// 	/**
// 	 * printLoginInformation
// 	 *
// 	 * Prints the login information to the console
// 	 */
// 	printLoginInformation(): void {

// 		if ( this.userInformation === null ) {
// 			this.loadUserProfile().then(
// 				(userData: KeycloakProfile) => {

// 					if ( this.settingsService.enableConsoleLogs ) {
// 						console.log('userData:');
// 						console.log(userData);
// 					}
// 				}
// 			);
// 		} else {

// 			this.updateLoginInformation().then(
// 				() => {

// 					if ( this.settingsService.enableConsoleLogs ) {
// 						console.log('userData:');
// 						console.log(this.userInformation);
// 					}

// 					if ( this.userGroups !== null && this.userGroups.length > 0 ) {
// 						if ( this.settingsService.enableConsoleLogs ) {
// 							console.log('userGroups:');
// 							console.log(this.userGroups);
// 						}
// 					}
// 				}
// 			);
// 		}
// 	}


// 	/**
// 	 * updateLoginInformation
// 	 *
// 	 * Gets the current user information and saves it
// 	 */
// 	updateLoginInformation(): Promise<any> {

// 		return this.isLoggedIn().then(
// 			(isUserLoggedIn: boolean) => {

// 				// After init, check if the user is logged in and safe the user profile
// 				if (isUserLoggedIn) {

// 					return this.loadUserProfile().then(
// 						(userProfile: KeycloakProfile) => {
// 							this.userInformation = userProfile;

// 							// Check if user is admin
// 							if ( this.getUserRoles().includes(KeycloakService.METADATA_ANNOTATION_ADMIN_ROLE) ) {
// 								this.userIsAdmin = true;
// 								this.isUserAdmin$$.next(true);
// 							} else {
// 								this.userIsAdmin = false;
// 								this.isUserAdmin$$.next(false);
// 							}

// 							// Get the usergroups
// 							return this.getKeycloakInstance().loadUserInfo().then(
// 								(userInfo: any) => {
// 									if ( userInfo && userInfo.usergroups && userInfo.usergroups.length > 0 ) {
// 										this.userGroups = this.parseUserGroups(userInfo.usergroups);
// 										return;
// 									}
// 								}
// 							)
// 						}
// 					);

// 				} else {
// 					this.userInformation = null as any;
// 					this.userGroups = [];
// 					return;
// 				}
// 			}
// 		);
// 	}


// 	/**
// 	 * parseUserGroups
// 	 *
// 	 * Pareses the usergroups strings
// 	 *
// 	 * @param userGroups
// 	 * @returns
// 	 */
// 	parseUserGroups(userGroups: string[]): string[] {

// 		if ( userGroups.length > 0 ) {

// 			for ( let i = 0; i < userGroups.length; i++ ) {

// 				if ( userGroups[i].indexOf('/', 0) !== -1 ) {
// 					userGroups[i] = userGroups[i].replace('/', '');
// 				}
// 			}

// 			return userGroups;

// 		} else {
// 			return [];
// 		}
// 	}


// 	/******************************************************************
// 							GETTERS AND SETTERS
// 	*******************************************************************/

// 	/**
// 	 * Getter authServerAddress
// 	 */
// 	get authServerAddress(): string {
// 		return this._authServerAddress;
// 	}

// 	/**
// 	 * Setter authServerAddress
// 	 */
// 	set authServerAddress(authServerAddress: string) {
// 		this._authServerAddress = authServerAddress;
// 	}

// 	/**
// 	 * Getter keycloakRealm
// 	 */
// 	 get keycloakRealm(): string {
// 		return this._keycloakRealm;
// 	}

// 	/**
// 	 * Setter keycloakRealm
// 	 */
// 	set keycloakRealm(keycloakRealm: string) {
// 		this._keycloakRealm = keycloakRealm;
// 	}

// 	/**
// 	 * Getter keycloakRealm
// 	 */
// 	 get keycloakClientId(): string {
// 		return this._keycloakClientId;
// 	}

// 	/**
// 	 * Setter keycloakClientId
// 	 */
// 	set keycloakClientId(keycloakClientId: string) {
// 		this._keycloakClientId = keycloakClientId;
// 	}

// 	/**
// 	 * Getter logoutAddress
// 	 */
// 	 get logoutAddress(): string {
// 		return this._logoutAddress;
// 	}


// 	/**
// 	 * Setter logoutAddress
// 	 */
// 	set logoutAddress(logoutAddress: string) {
// 		this._logoutAddress = logoutAddress;
// 	}


// 	/**
// 	 * Getter userIsAdmin
// 	 */
// 	 get userIsAdmin(): boolean {
// 		return this._userIsAdmin;
// 	}


// 	/**
// 	 * Setter userIsAdmin
// 	 */
// 	set userIsAdmin(userIsAdmin: boolean) {
// 		this._userIsAdmin = userIsAdmin;
// 	}


// 	/**
// 	 * Getter userInformation
// 	 */
// 	get userInformation(): KeycloakProfile {
// 		return this._userInformation;
// 	}


// 	/**
// 	 * Setter userInformation
// 	 */
// 	set userInformation(userInformation: KeycloakProfile) {
// 		this._userInformation = userInformation;
// 	}


// 	/**
// 	 * Getter userGroups
// 	 */
// 	 get userGroups(): string[] {
// 		return this._userGroups;
// 	}


// 	/**
// 	 * Setter userGroups
// 	 */
// 	set userGroups(userGroups: string[]) {
// 		this._userGroups = userGroups;
// 	}


// 	/**
// 	 * initializeKeycloak
// 	 *
// 	 * Initializes the keycloak functionality (also connects to keycloak service)
// 	 *
// 	 * @param keycloak
// 	 * @param loadingService
// 	 * @param dev
// 	 * @returns
// 	 */
// 	static initializeKeycloak(keycloak: KeycloakService, loadingService: LoadingService, dev?: boolean): () => Promise<void> {
// 		return () =>

// 			keycloak.init({
// 				config: {
// 					url: dev ? 'http://localhost:8081/auth' : keycloak.authServerAddress,
// 					realm: dev ? 'master' : keycloak.keycloakRealm,
// 					clientId: dev ? 'keycloak-angular' : keycloak.keycloakClientId,
// 				},
// 				initOptions: {
// 					onLoad: 'check-sso',
// 					silentCheckSsoRedirectUri:
// 						window.location.origin + '/metadata-annotation/assets/auth/silent-check-sso.html',
// 				},
// 			}).then(
// 				(isUserLoggedIn: boolean) => {

// 					// After init, check if the user is logged in and safe the user profile
// 					if (isUserLoggedIn) {

// 						keycloak.loadUserProfile().then(
// 							(userProfile: KeycloakProfile) => {
// 								keycloak.userInformation = userProfile;

// 								// Check if user is admin
// 								if ( keycloak.getUserRoles().includes(KeycloakService.METADATA_ANNOTATION_ADMIN_ROLE) ) {
// 									keycloak.userIsAdmin = true;
// 								}

// 								// Get the usergroups
// 								keycloak.getKeycloakInstance().loadUserInfo().then(
// 									(userInfo: any) => {
// 										if ( userInfo && userInfo.usergroups && userInfo.usergroups.length > 0 ) {
// 											keycloak.userGroups = keycloak.parseUserGroups(userInfo.usergroups);
// 										}
// 									}
// 								)
// 							}
// 						)
// 					} else {
// 						keycloak.userInformation = null as any;
// 					}
// 				}
// 			).catch(
// 				(reason: any) => {
// 					console.warn('Error with Keycloak:');
// 					console.warn(reason);
// 				}
// 			);
// 	}
// }

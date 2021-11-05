import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class SettingsService {

	/******************************************************************
							GENERAL SETTINGS
	*******************************************************************/

	// Backend server address
	private _backendServerAddress: string = 'http://localhost:8080/metadata/xsd';

	// Enable console logs
	private _enableConsoleLogs: boolean = true;


	/******************************************************************
								AUTOCOMPLETE
	*******************************************************************/

	// Default header text for window.alert calls
	private _defaultAlertHeaderText: string = 'Notification';

	/******************************************************************
								AUTOCOMPLETE
	*******************************************************************/

	// Setting options (DON'T CHANGE)
	public readonly DESCRIPTION_MODE_INLINE: number = 0;
	public readonly DESCRIPTION_MODE_POPOUT: number = 1;

	// Description mode
	private _descriptionMode: number = this.DESCRIPTION_MODE_POPOUT;

	// Frontend sorting
	private _frontendSorting: boolean = false;


	/**
	 * constructor
	 */
	constructor() {}


	/******************************************************************
							GETTERS AND SETTERS
	*******************************************************************/

	/**
	 * Getter backendServerAddress
	 */
	 get backendServerAddress(): string {
		return this._backendServerAddress;
	}


	/**
	 * Setter backendServerAddress
	 */
	set backendServerAddress(backendServerAddress: string) {
		this._backendServerAddress = backendServerAddress;
	}


	/**
	 * Getter enableConsoleLogs
	 */
	get enableConsoleLogs(): boolean {
		return this._enableConsoleLogs;
	}


	/**
	 * Setter enableConsoleLogs
	 */
	set enableConsoleLogs(enableConsoleLogs: boolean) {
		this._enableConsoleLogs = enableConsoleLogs;
	}


	/**
	 * Getter defaultAlertHeaderText
	 */
	 get defaultAlertHeaderText(): string {
		return this._defaultAlertHeaderText;
	}


	/**
	 * Setter defaultAlertHeaderText
	 */
	 set defaultAlertHeaderText(defaultAlertHeaderText: string) {
		this._defaultAlertHeaderText = defaultAlertHeaderText;
	}


	/**
	 * Getter descriptionMode
	 */
	 get descriptionMode(): number {
		return this._descriptionMode;
	}


	/**
	 * Setter descriptionMode
	 */
	set descriptionMode(descriptionMode: number) {
		this._descriptionMode = descriptionMode;
	}


	/**
	 * Getter frontendSorting
	 */
	 get frontendSorting(): boolean {
		return this._frontendSorting;
	}


	/**
	 * Setter frontendSorting
	 */
	set frontendSorting(frontendSorting: boolean) {
		this._frontendSorting = frontendSorting;
	}
}

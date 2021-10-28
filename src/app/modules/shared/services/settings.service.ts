import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class SettingsService {

	private _enableConsoleLogs: boolean = true;

	constructor() {

	}


	/******************************************************************
							GETTERS AND SETTERS
	*******************************************************************/

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
}

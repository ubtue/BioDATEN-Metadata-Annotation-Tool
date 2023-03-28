import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class SettingsService {

	/******************************************************************
							GENERAL SETTINGS
	*******************************************************************/

	// Backend server address
	private _backendServerAddress: string = 'https://193.196.29.32/metadata/';
	// private _backendServerAddress: string = 'http://localhost:8080/metadata/';

	// Enable console logs
	private _enableConsoleLogs: boolean = false;


	/******************************************************************
								ALERTS
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

	// Max amount of entries
	private _maxAutocompleteEntriesCount: number = 150;

	// Pixel threshold for mobile display of popout
	private _popoutDescriptionMobileWidthThreshold:number = 768;

	// Frontend sorting
	private _frontendSorting: boolean = false;

	// Server Address to the schemas of the autocomplete
	private _autocompleteSchemasServerAddress: string = this.backendServerAddress + 'autocomplete-schemas/';

	// Server Address to the mappings of the autocomplete
	private _autocompleteMappingServerAddress: string = this.backendServerAddress + 'autocomplete-mapping/';


	/******************************************************************
							RENDER OPTIONS
	*******************************************************************/

	// Server address to the render options
	private _renderOptionsServerAddress: string = this.backendServerAddress + 'render-option/';

	// Show render options with detail view
	private _renderOptionsDetailView: boolean = true;


	/******************************************************************
							METADATA ANNOTATION FORM
	*******************************************************************/

	// Server address to the xsd processor
	private _metadataAnnotationFormServerAddress: string = this.backendServerAddress + 'xsd/'

	// Flex Layout (Wether to display inputs side by side on larger displays)
	private _metadataAnnotationFormFlexLayout: boolean = true;


	/******************************************************************
								USER RESOURCES
	*******************************************************************/

	// Server Address to the user resouces
	// private _userResourceServerAddress: string = 'assets/dummy-data/user-data/dummy_user-data.json';
	private _userResourceServerAddress: string = this.backendServerAddress + 'metadata/';

	// Default Sorting field of user resouces
	private _defaultUserResourceSortingField: string = 'lastChange';

	// Default Sorting method of user resouces
	private _defaultUserResourceSortingMethod: string = 'desc';


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
	 * Getter maxAutocompleteEntriesCount
	 */
	 get maxAutocompleteEntriesCount(): number {
		return this._maxAutocompleteEntriesCount;
	}


	/**
	 * Setter maxAutocompleteEntriesCount
	 */
	set maxAutocompleteEntriesCount(maxAutocompleteEntriesCount: number) {
		this._maxAutocompleteEntriesCount = maxAutocompleteEntriesCount;
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
	 * Getter popoutDescriptionMobileWidthThreshold
	 */
	 get popoutDescriptionMobileWidthThreshold(): number {
		return this._popoutDescriptionMobileWidthThreshold;
	}


	/**
	 * Setter popoutDescriptionMobileWidthThreshold
	 */
	set popoutDescriptionMobileWidthThreshold(popoutDescriptionMobileWidthThreshold: number) {
		this._popoutDescriptionMobileWidthThreshold = popoutDescriptionMobileWidthThreshold;
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


	/**
	 * Getter autocompleteSchemasServerAddress
	 */
	get autocompleteSchemasServerAddress(): string {
		return this._autocompleteSchemasServerAddress;
	}


	/**
	 * Setter autocompleteSchemasServerAddress
	 */
	set autocompleteSchemasServerAddress(autocompleteSchemasServerAddress: string) {
		this._autocompleteSchemasServerAddress = autocompleteSchemasServerAddress;
	}


	/**
	 * Getter autocompleteMappingServerAddress
	 */
	get autocompleteMappingServerAddress(): string {
		return this._autocompleteMappingServerAddress;
	}


	/**
	 * Setter autocompleteMappingServerAddress
	 */
	set autocompleteMappingServerAddress(autocompleteMappingServerAddress: string) {
		this._autocompleteMappingServerAddress = autocompleteMappingServerAddress;
	}


	/**
	 * Getter renderOptionsServerAddress
	 */
	 get renderOptionsServerAddress(): string {
		return this._renderOptionsServerAddress;
	}


	/**
	 * Setter renderOptionsServerAddress
	 */
	set renderOptionsServerAddress(renderOptionsServerAddress: string) {
		this._renderOptionsServerAddress = renderOptionsServerAddress;
	}


	/**
	 * Getter renderOptionsDetailView
	 */
	 get renderOptionsDetailView(): boolean {
		return this._renderOptionsDetailView;
	}


	/**
	 * Setter renderOptionsDetailView
	 */
	set renderOptionsDetailView(renderOptionsDetailView: boolean) {
		this._renderOptionsDetailView = renderOptionsDetailView;
	}


	/**
	 * Getter metadataAnnotationFormServerAddress
	 */
	 get metadataAnnotationFormServerAddress(): string {
		return this._metadataAnnotationFormServerAddress;
	}


	/**
	 * Setter metadataAnnotationFormServerAddress
	 */
	set metadataAnnotationFormServerAddress(metadataAnnotationFormServerAddress: string) {
		this._metadataAnnotationFormServerAddress = metadataAnnotationFormServerAddress;
	}


	/**
	 * Getter metadataAnnotationFormFlexLayout
	 */
	 get metadataAnnotationFormFlexLayout(): boolean {
		return this._metadataAnnotationFormFlexLayout;
	}


	/**
	 * Setter metadataAnnotationFormFlexLayout
	 */
	set metadataAnnotationFormFlexLayout(metadataAnnotationFormFlexLayout: boolean) {
		this._metadataAnnotationFormFlexLayout = metadataAnnotationFormFlexLayout;
	}


	/**
	 * Getter userResourceServerAddress
	 */
	 get userResourceServerAddress(): string {
		return this._userResourceServerAddress;
	}


	/**
	 * Setter userResourceServerAddress
	 */
	set userResourceServerAddress(userResourceServerAddress: string) {
		this._userResourceServerAddress = userResourceServerAddress;
	}


	/**
	 * Getter defaultUserResourceSortingField
	 */
	 get defaultUserResourceSortingField(): string {
		return this._defaultUserResourceSortingField;
	}


	/**
	 * Setter defaultUserResourceSortingField
	 */
	set defaultUserResourceSortingField(defaultUserResourceSortingField: string) {
		this._defaultUserResourceSortingField = defaultUserResourceSortingField;
	}


	/**
	 * Getter defaultUserResourceSortingMethod
	 */
	 get defaultUserResourceSortingMethod(): string {
		return this._defaultUserResourceSortingMethod;
	}


	/**
	 * Setter defaultUserResourceSortingMethod
	 */
	set defaultUserResourceSortingMethod(defaultUserResourceSortingMethod: string) {
		this._defaultUserResourceSortingMethod = defaultUserResourceSortingMethod;
	}
}

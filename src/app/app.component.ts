import { NavigationEnd, Router, Event } from '@angular/router';
import { OidcService } from './modules/core/services/oidc.service';
import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { AlertService } from './modules/shared/services/alert.service';
import { Platform } from '@angular/cdk/platform';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { UpdateNavigationService } from './modules/core/services/update-navigation.service';
import { EventHelperService } from './modules/shared/services/event-helper.service';
import { SettingsService } from './modules/shared/services/settings.service';
import { startWith, takeUntil, filter } from 'rxjs/operators';
import { UserInformationService } from './modules/shared/services/user-information.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

	title = 'metadata-annotation';
	currentMenuToggle: boolean = false;

	private ngUnsubscribe = new Subject();
	currentMenuTogglesubscription: Subscription = new Subscription;

	userLoggedIn: boolean = false;

	/**
	 * constructor
	 */
	constructor(private updateNavigationService: UpdateNavigationService,
				private eventHelperService: EventHelperService,
				private platform: Platform,
				private alertService: AlertService,
				private settingsService: SettingsService,
				public oidcSecurityService: OidcSecurityService,
				private oidcService: OidcService,
				private publicEventsService: PublicEventsService,
				private router: Router,
				private userInformationService: UserInformationService) {}


	/**
	 * HostListener for document click on the entire page
	 * @param event
	 */
	@HostListener('document:click', ['$event'])
	documentClick(event: any): void {

		// Forward the click to the event helper service with the clicked target attached
		this.eventHelperService.triggerDocumentClick(event.target);

		// Remove tab_focus if mouse is used
		document.body.classList.remove('tab_focus');
	}


	/**
	 * HostListener for document keydown (tab key) on the entire page
	 * @param event
	 */
	@HostListener('document:keydown.tab', ['$event'])
	documentTab(event: any): void {

		// Add tab_focus to body if content is browsed with tab key
		document.body.classList.add('tab_focus');
	}

	/**
	 * ngOnInit
	 */
	ngOnInit(): void {

		// Override the global alert function
		// Use the custom alert instead
		window.alert = (message: string) => {
			this.alertService.showAlert(this.settingsService.defaultAlertHeaderText, message);
		}

		// Subscribe to the toggleMenu observable
		this.currentMenuTogglesubscription = this.updateNavigationService.currentMenuToggle
		.pipe(
			startWith(false),
			takeUntil(this.ngUnsubscribe)
		)
		.subscribe((manualToggle: boolean) => {

			if ( manualToggle ) {
				this.setCurrentMenuToggle(!!!this.currentMenuToggle);
			} else {
				this.setCurrentMenuToggle(false);
			}

		});

		// If the Browser is Chrome or Edge > v79 (blink) or a webkit Browser
		// add a flag for supporting @property in CSS
		if ( this.platform.BLINK || this.platform.WEBKIT ) {
			document.body.classList.add('css_property_support');
		}

		// Set connection to authentication service
		this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken }) => {

			if ( this.settingsService.enableConsoleLogs ) {

				console.groupCollapsed('user info');

				console.log('app authenticated', isAuthenticated);
				console.log(`Current access token is '${accessToken}'`);
				console.log('userdata:');
				console.log(userData);

				console.groupEnd();
			}

			// If user is logged in
			if ( isAuthenticated && accessToken ) {

				// Set flag
				this.userLoggedIn = true;

				// Parse the access token
				let parsedToken = this.oidcService.parseAccessToken(accessToken);

				if ( this.settingsService.enableConsoleLogs ) {
					console.log('Parsed access token:');
					console.log(parsedToken);
				}

				// Get all client roles
				let clientRoles = this.oidcService.getClientRolesFromAccessToken(parsedToken);

				if ( clientRoles.length === 0 ) {
					console.warn('There was a problem fetching client roles. Check the client or realm config.');
				}

				// Check if there is a entry in the database for the user and handle everything about it
				this.userInformationService.handleUserInformationOnLoad(this.oidcService.getUserIdFromUserData({'userData' : userData}));

				// Check if the user is admin and set state
				if ( clientRoles.includes(OidcService.METADATA_ANNOTATION_ADMIN_ROLE) ) {
					this.oidcService.setAdminState(true);
				} else {
					this.oidcService.setAdminState(false);
				}

				// If the user is logged in and the route is / the user needs to be redirected to /user/metadata-resources
				this.router.events.subscribe((event: Event) => {

					if (event instanceof NavigationEnd) {
						if ( event.url === '/' ) {
							this.router.navigate(['/user/metadata-resources']);
						}
					}
				});
			}
		});

		this.publicEventsService
			.registerForEvents()
			.pipe(filter((notification) => notification.type === EventTypes.CheckSessionReceived))
			.subscribe((value) => {if ( this.settingsService.enableConsoleLogs ) {console.log('CheckSessionReceived with value from app', value)}});
	}


	/**
	 * ngOnDestroy
	 */
	ngOnDestroy(): void {
		this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
	}


	/**
	 * onMenuOpenedChange
	 *
	 * @param currentState
	 */
	onMenuOpenedChange(currentState: boolean): void {
		this.currentMenuToggle = currentState;
	}

	/**
	 * getCurrentMenuToggle
	 *
	 * Return the current toggle state of the menu
	 *
	 * @returns
	 */
	getCurrentMenuToggle(): boolean {
		return this.currentMenuToggle;
	}


	/**
	 * setCurrentMenuToggle
	 *
	 * Set the current toggle state of the menu
	 *
	 * @param show
	 */
	setCurrentMenuToggle(show: boolean): void {
		this.currentMenuToggle = show;
	}
}

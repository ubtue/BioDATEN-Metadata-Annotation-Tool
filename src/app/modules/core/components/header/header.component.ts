import { OidcService } from './../../services/oidc.service';
import { OidcClientNotification, OidcSecurityService, OpenIdConfiguration, UserDataResult } from 'angular-auth-oidc-client';
import { EventHelperService } from './../../../shared/services/event-helper.service';
import { UpdateNavigation } from './../../../shared/models/update-navigation.model';
import { UpdateNavigationService } from './../../../core/services/update-navigation.service';
import { Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { takeUntil, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

	@ViewChild('headerUserIconWrap') headerUserIconWrap!: ElementRef;

	private ngUnsubscribe = new Subject();
	currentViewsubscription: Subscription = new Subscription;
	currentViewLabel: string = "";
	currentViewValue: string = "";

	userIsLoggedIn: boolean = false;

	showUserMenu: boolean = false;

	configuration$: Observable<OpenIdConfiguration> = {} as any;
	userDataChanged$: Observable<OidcClientNotification<any>> = {} as any;
	userData$: Observable<UserDataResult> = {} as any;
	isAuthenticated = false;


	/**
	 * constructor
	 */
	constructor(private updateNavigationService: UpdateNavigationService,
		public oidcSecurityService: OidcSecurityService,
		public oidcService: OidcService,
		private settingsService: SettingsService,
		private eventHelperService: EventHelperService) {

	}


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {
		this.currentViewsubscription = this.updateNavigationService.currentView
			.pipe(
				startWith({ label: '', value: '' }),
				takeUntil(this.ngUnsubscribe)
			)
			.subscribe((currentView: UpdateNavigation) => {
				this.currentViewLabel = currentView.label + " ";
				this.currentViewValue = currentView.value;
			});

		// Listen to clicks from the document
		this.eventHelperService.documentClickedTarget.subscribe(target => this.documentClickListener(target));

		this.configuration$ = this.oidcSecurityService.getConfiguration();
		this.userData$ = this.oidcSecurityService.userData$;

		this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
			this.userIsLoggedIn = isAuthenticated;
		});
	}


	/**
	 * ngOnDestroy
	 */
	ngOnDestroy(): void {
		this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
	}


	/**
	 * onClickToggleMenu
	 */
	onClickToggleMenu(): void {
		this.updateNavigationService.updateMenuToggle(true);
	}


	/**
	 * onClickUserIcon
	 */
	onClickUserIcon(): void {
		this.toggleUserMenu();
	}


	/**
	 * onClickLogin
	 * @param event
	 */
	onClickLogin(event: Event): void {
		event.preventDefault();
		this.oidcService.customLogin();
	}


	/**
	 * onClickLogout
	 * @param event
	 */
	onClickLogout(event: Event): void {
		event.preventDefault();
		this.oidcSecurityService.logoff().subscribe(() => {});
	}


	/**
	 * openUserMenu
	 *
	 * Opens user menu
	 */
	openUserMenu(): void {
		this.toggleUserMenu(true, false);
	}


	/**
	 * closeUserMenu
	 *
	 * Closes user menu
	 */
	closeUserMenu(): void {
		this.toggleUserMenu(false, true);
	}


	/**
	 * toggleUserMenu
	 *
	 * Toggles the user menu
	 *
	 * @param forceShow
	 * @param forceClose
	 */
	private toggleUserMenu(forceShow?: boolean, forceClose?: boolean) {

		// If the menu is forced open/close, open/close it
		if (forceShow) {
			this.showUserMenu = true;

		} else if (forceClose) {
			this.showUserMenu = false;

		} else {

			// Toggle the state of the menu
			if (this.showUserMenu) {
				this.showUserMenu = false;
			} else {
				this.showUserMenu = true;
			}
		}
	}


	/**
	 * documentClickListener
	 *
	 * Handles a click on the document
	 *
	 * @param target
	 */
	private documentClickListener(target: HTMLElement): void {
		if (!this.headerUserIconWrap.nativeElement.contains(target)) {
			this.closeUserMenu();
		}
	}
}

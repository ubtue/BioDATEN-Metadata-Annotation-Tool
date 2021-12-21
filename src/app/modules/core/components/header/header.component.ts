import { KeycloakProfile } from 'keycloak-js';
import { EventHelperService } from './../../../shared/services/event-helper.service';
import { UpdateNavigation } from './../../../shared/models/update-navigation.model';
import { UpdateNavigationService } from './../../../core/services/update-navigation.service';
import { Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { KeycloakService } from '../../services/keycloak.service';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { takeUntil, startWith } from 'rxjs/operators';
import { KeycloakEventType } from 'keycloak-angular';

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
	userIsAdmin: boolean = false;
	userInformation: KeycloakProfile = null as any;

	showUserMenu: boolean = false;


	/**
	 * constructor
	 */
	constructor(private updateNavigationService: UpdateNavigationService,
		private keycloakService: KeycloakService,
		private settingsService: SettingsService,
		private eventHelperService: EventHelperService) {

		// Check if user is logged in
		this.keycloakService.isLoggedIn().then(
			(loginResult: boolean) => {
				this.userIsLoggedIn = loginResult;

				// Check if user is admin
				this.userIsAdmin = this.keycloakService.userIsAdmin;

				// Get user information
				this.userInformation = this.keycloakService.userInformation;

				this.keycloakService.keycloakEvents$
				.pipe(
					takeUntil(this.ngUnsubscribe)
				)
				.subscribe({
					next: e => {
						if (e.type == KeycloakEventType.OnTokenExpired) {
							console.log('EXPIRE');
							keycloakService.updateToken(360);
						}
					}
				});

				if (loginResult && this.settingsService.enableConsoleLogs) {
					this.keycloakService.printLoginInformation();
				}
			}
		);
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
	}


	/**
	 * ngOnDestroy
	 */
	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
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
		this.keycloakService.customLogin();
	}


	/**
	 * onClickLogout
	 * @param event
	 */
	onClickLogout(event: Event): void {
		event.preventDefault();
		this.keycloakService.customLogout();
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

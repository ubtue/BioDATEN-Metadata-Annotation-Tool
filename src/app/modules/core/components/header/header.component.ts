import { EventHelperService } from './../../../shared/services/event-helper.service';
import { UpdateNavigation } from './../../../shared/models/update-navigation.model';
import { UpdateNavigationService } from './../../../core/services/update-navigation.service';
import { Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { KeycloakService } from '../../services/keycloak.service';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

	@ViewChild('headerUserIconWrap') headerUserIconWrap!: ElementRef;

	currentViewsubscription: Subscription = new Subscription;
	currentViewLabel: string = "";
	currentViewValue: string = "";

	userIsLoggedIn: boolean = false;
	userInformation: any = null;

	showUserMenu: boolean = false;

	constructor(private updateNavigationService: UpdateNavigationService,
				private keycloakService: KeycloakService,
				private settingsService: SettingsService,
				private eventHelperService: EventHelperService) {

					// Check if user is logged in
					this.keycloakService.isLoggedIn().then(
						(loginResult: boolean) => {
							this.userIsLoggedIn = loginResult;

							if ( loginResult && this.settingsService.enableConsoleLogs ) {
								this.keycloakService.printLoginInformation();
							}
						}
					);
				}

	ngOnInit(): void {
		this.currentViewsubscription = this.updateNavigationService.currentView.subscribe((currentView: UpdateNavigation) => {
			this.currentViewLabel = currentView.label + " ";
			this.currentViewValue = currentView.value;
		});

		// Listen to clicks from the document
		this.eventHelperService.documentClickedTarget.subscribe(target => this.documentClickListener(target));
	}

	onClickToggleMenu():void {
		this.updateNavigationService.updateMenuToggle(true);
	}

	onClickUserIcon() : void {
		this.toggleUserMenu();
	}

	onClickLogin(event: Event): void {
		event.preventDefault();
		this.keycloakService.customLogin();
	}

	onClickLogout(event: Event): void {
		event.preventDefault();
		this.keycloakService.customLogout();
	}

	ngOnDestroy(): void {
		this.currentViewsubscription.unsubscribe();
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
		if ( forceShow ) {
			this.showUserMenu = true;

		} else if ( forceClose ) {
			this.showUserMenu = false;

		} else {

			// Toggle the state of the menu
			if ( this.showUserMenu ) {
				this.showUserMenu = false;
			} else {
				this.showUserMenu = true;
			}
		}
	}


	/**
	 * openUserMenu
	 *
	 * Opens user menu
	 */
	private openUserMenu(): void {
		this.toggleUserMenu(true, false);
	}


	/**
	 * closeUserMenu
	 *
	 * Closes user menu
	 */
	private closeUserMenu(): void {
		this.toggleUserMenu(false, true);
	}


	private documentClickListener(target: HTMLElement): void {
		if (!this.headerUserIconWrap.nativeElement.contains(target) ) {
			this.closeUserMenu();
		}
	}
}

import { KeycloakProfile } from 'keycloak-js';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'src/app/modules/core/services/keycloak.service';
import { UpdateNavigationService } from 'src/app/modules/core/services/update-navigation.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	userInformation: KeycloakProfile = null as any;

	constructor(private updateNavigationService: UpdateNavigationService,
				private keycloakService: KeycloakService) {

					this.userInformation = keycloakService.userInformation;

				}

	ngOnInit(): void {
		this.updateNavigationService.updateCurrentView("User profile", "");
	}

	onClickTest(): void {

	}
}

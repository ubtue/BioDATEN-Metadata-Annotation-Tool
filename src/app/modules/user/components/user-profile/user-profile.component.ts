import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'src/app/modules/core/services/keycloak.service';
import { UpdateNavigationService } from 'src/app/modules/core/services/update-navigation.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	constructor(private updateNavigationService: UpdateNavigationService,
				private keycloakService: KeycloakService) { }

	ngOnInit(): void {
		this.updateNavigationService.updateCurrentView("User:", "Profile");
	}

	onClickTest(): void {
		console.log(this.keycloakService.userInformation);
	}
}

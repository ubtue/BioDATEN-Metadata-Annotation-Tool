import { UserDataResult, OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UpdateNavigationService } from 'src/app/modules/core/services/update-navigation.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	userData$: Observable<UserDataResult> = {} as any;

	userInformation: any;

	constructor(private updateNavigationService: UpdateNavigationService,
				public oidcSecurityService: OidcSecurityService
				) {}

	ngOnInit(): void {
		this.updateNavigationService.updateCurrentView("User profile", "");

		this.userData$ = this.oidcSecurityService.userData$;

		this.userData$.subscribe(userData => {
			this.userInformation = userData.userData;
		});
	}
}

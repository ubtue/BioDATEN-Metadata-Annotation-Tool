import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Router,
	RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService as AngularKeycloakService } from 'keycloak-angular';
import { KeycloakService } from '../services/keycloak.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {

	/**
	 * constructor
	 */
	constructor(
		protected readonly router: Router,
		protected readonly keycloak: KeycloakService
	) {
		super(router, keycloak);
	}


	/**
	 * isAccessAllowed
	 *
	 * Checks if user is allow access to route
	 *
	 * @param route
	 * @param state
	 * @returns
	 */
	public async isAccessAllowed(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	) {

		// Force the user to log in if currently unauthenticated.
		// if (!this.authenticated) {
		// 	await this.keycloak.login({
		// 		redirectUri: window.location.origin + state.url,
		// 	});
		// }

		// return this.keycloak.isLoggedIn().then((result: boolean) => { return result });

		// Get the roles required from the route.
		const requiredRoles = route.data.roles;

		// Allow the user to to proceed if no additional roles are required to access the route.
		if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
			return this.keycloak.isLoggedIn().then((result: boolean) => { return result });
		}

		// Allow the user to proceed if all the required roles are present.
		return requiredRoles.every((role) => this.roles.includes(role));
	}
}

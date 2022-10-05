import { OidcService } from './../services/oidc.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthorizationGuard implements CanActivate {

	/**
	 * constructor
	 */
	constructor(private oidcSecurityService: OidcSecurityService,
				private router: Router,
				private oidcService: OidcService) { }


	/**
	 * canActivate
	 *
	 * Checks if the route can be activated by user
	 *
	 * @param route
	 * @param state
	 * @returns
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {

		return this.oidcSecurityService.getAccessToken().pipe(
			map(accessToken => {

				// Get the roles required from the route.
				const requiredRoles = route.data.roles as string[];

				// Allow the user to to proceed if no additional roles are required to access the route and user is logged in.
				if ( !(requiredRoles instanceof Array) || requiredRoles.length === 0 ) {
					return !!accessToken;
				}

				// If no access token exists, user in not logged in
				if ( accessToken ) {

					// Get the client roles from a parsed access token
					let parsedAccessToken = this.oidcService.parseAccessToken(accessToken);
					let clientRoles = this.oidcService.getClientRolesFromAccessToken(parsedAccessToken);

					// Check if the client roles match the required roles
					let hasRoles = requiredRoles.every((role) => clientRoles.includes(role));

					if ( hasRoles ) {
						return true;
					}

					// Redirect if not authenticated
					return this.router.parseUrl('/');
				}

				// Redirect if not authenticated
				return this.router.parseUrl('/');
			})
		);
	}
}

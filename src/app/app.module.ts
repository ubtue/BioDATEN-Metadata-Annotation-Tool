import { LoadingScreenModule } from './modules/loading-screen/loading-screen-module';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from './modules/core/services/keycloak.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTransferService } from './modules/core/services/data-transfer.service';
import { HeaderComponent } from './modules/core/components/header/header.component';
import { FooterComponent } from './modules/core/components/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { SideNavComponent } from './modules/core/components/side-nav/side-nav.component';
import { LoadingInterceptor } from './modules/core/interceptors/loading.interceptor';
import { LoadingService } from './modules/core/services/loading.service';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from './modules/shared/directives/directives.module';
import { KeycloakAngularModule} from 'keycloak-angular';


function initializeKeycloak(keycloak: KeycloakService, loadingService: LoadingService): () => Promise<void> {
	return () =>

	  	// keycloak.init({

		// 	config: {
		// 		url: 'http://localhost:8081/auth',
		// 		realm: 'master',
		// 		clientId: 'keycloak-angular',
		// 	},
		// 	initOptions: {
		// 		onLoad: 'check-sso',
		// 		silentCheckSsoRedirectUri:
		// 			window.location.origin + '/assets/auth/silent-check-sso.html',
		// 	},
		// 	enableBearerInterceptor: true,
		// 	bearerExcludedUrls: ['/assets']
	  	// })
		// .then(
		// 	(isUserLoggedIn: boolean) => {

		// 		// After init, check if the user is logged in and safe the user profile
		// 		if ( isUserLoggedIn ) {

		// 			keycloak.loadUserProfile().then(
		// 				(userProfile: KeycloakProfile) => {
		// 					keycloak.userInformation = userProfile;
		// 				}
		// 			)
		// 		} else {
		// 			keycloak.userInformation = null as any;
		// 		}

		// 	}
		// ).catch(
		// 	(reason: any) => {
		// 		console.warn('Error with Keycloak:');
		// 		console.warn(reason);
		// 	}
		// );

		keycloak.init({
			config: {
				url: keycloak.authServerAddress,
				realm: keycloak.keycloakRealm,
				clientId: keycloak.keycloakClientId,
			},
			initOptions: {
				onLoad: 'check-sso',
				silentCheckSsoRedirectUri:
					window.location.origin + '/assets/auth/silent-check-sso.html',
			},
	  	}).then(
			(isUserLoggedIn: boolean) => {

				// After init, check if the user is logged in and safe the user profile
				if ( isUserLoggedIn ) {

					keycloak.loadUserProfile().then(
						(userProfile: KeycloakProfile) => {
							keycloak.userInformation = userProfile;
						}
					)
				} else {
					keycloak.userInformation = null as any;
				}
			}
		).catch(
			(reason: any) => {
				console.warn('Error with Keycloak:');
				console.warn(reason);
			}
		);
}

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		SideNavComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		BrowserAnimationsModule,
		MatSidenavModule,
		MatIconModule,
		MatProgressSpinnerModule,
		DirectivesModule,
		KeycloakAngularModule,
		MatTableModule,
		LoadingScreenModule
	],
	providers: [
		DataTransferService,
		HeaderComponent,
		LoadingService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoadingInterceptor,
			multi: true,
		},
		{
			provide: APP_INITIALIZER,
			useFactory: initializeKeycloak,
			multi: true,
			deps: [KeycloakService],
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

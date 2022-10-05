import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';

@NgModule({
	imports: [
		AuthModule.forRoot({
			config: {
				authority: 'https://portal.biodaten.info/auth/realms/biodaten',
				redirectUrl: window.location.origin + '/metadata-annotation/#/user/metadata-resources',
				postLogoutRedirectUri: window.location.origin + '/metadata-annotation/',
				clientId: 'annotation-biodaten',
				scope: 'openid offline_access email',
				responseType: 'code',
				silentRenew: true,
				silentRenewUrl: window.location.origin + '/metadata-annotation/assets/auth/silent-renew.html',
				silentRenewTimeoutInSeconds: 360,
				useRefreshToken: true,
				logLevel: LogLevel.Error,
				ignoreNonceAfterRefresh: true,
			},
		}),
	],
	exports: [AuthModule],
})
export class AuthConfigModule { }


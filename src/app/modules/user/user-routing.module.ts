import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from '../core/authguard/authorization-guard.authgard';
import { UserMetadataResourcesComponent } from './components/user-metadata-resources/user-metadata-resources.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserProfileApiKeyComponent } from './components/user-profile/user-profile-api-key/user-profile-api-key.component';

// Detail Routes
const detailRoutes: Routes = [
	{ path: 'profile/api-key', component: UserProfileApiKeyComponent, canActivate: [AuthorizationGuard] },
];

const routes: Routes = [
	{ path: 'profile', component: UserProfileComponent, canActivate: [AuthorizationGuard], children: detailRoutes },
	{ path: 'metadata-resources', component: UserMetadataResourcesComponent, canActivate: [AuthorizationGuard]},
	...detailRoutes
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthorizationGuard]
})
export class UserRoutingModule { }

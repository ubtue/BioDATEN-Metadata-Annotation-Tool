import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from '../core/authguard/authorization-guard.authgard';
import { UserMetadataResourcesComponent } from './components/user-metadata-resources/user-metadata-resources.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
	{ path: 'profile', component: UserProfileComponent, canActivate: [AuthorizationGuard] },
	{ path: 'metadata-resources', component: UserMetadataResourcesComponent, canActivate: [AuthorizationGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthorizationGuard]
})
export class UserRoutingModule { }

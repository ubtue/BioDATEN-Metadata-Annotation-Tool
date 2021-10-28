import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/authguard/authguard.authgard';
import { UserMetadataResourcesComponent } from './components/user-metadata-resources/user-metadata-resources.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
	{ path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
	{ path: 'metadata-resources', component: UserMetadataResourcesComponent, canActivate: [AuthGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthGuard]
})
export class UserRoutingModule { }

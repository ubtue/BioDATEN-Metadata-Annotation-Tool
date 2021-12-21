import { AdministrationAutocompleteComponent } from './components/administration-autocomplete/administration-autocomplete.component';
import { KeycloakService } from 'src/app/modules/core/services/keycloak.service';
import { AdministrationComponent } from './components/administration/administration.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/authguard/authguard.authgard';

const routes: Routes = [
	{ path: '', component: AdministrationComponent, canActivate: [AuthGuard], data: { roles: [KeycloakService.METADATA_ANNOTATION_ADMIN_ROLE] } },
	{ path: 'autocomplete', component: AdministrationAutocompleteComponent, canActivate: [AuthGuard], data: { roles: [KeycloakService.METADATA_ANNOTATION_ADMIN_ROLE] } }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthGuard]
})
export class AdministrationRoutingModule { }

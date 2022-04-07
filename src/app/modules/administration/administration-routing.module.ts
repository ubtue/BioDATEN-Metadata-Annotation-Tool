import { AdministrationRenderOptionsDetailsComponent } from './components/administration-render-options/administration-render-options-details/administration-render-options-details.component';
import { AdministrationAutocompleteComponent } from './components/administration-autocomplete/administration-autocomplete.component';
import { KeycloakService } from 'src/app/modules/core/services/keycloak.service';
import { AdministrationComponent } from './components/administration/administration.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/authguard/authguard.authgard';
import { AdministrationSchemasComponent } from './components/administration-schemas/administration-schemas.component';
import { AdministrationRenderOptionsComponent } from './components/administration-render-options/administration-render-options.component';

// Detail Routes
const detailRoutes: Routes = [
	{ path: 'render-options/details/:id', component: AdministrationRenderOptionsDetailsComponent, canActivate: [AuthGuard], data: { roles: [KeycloakService.METADATA_ANNOTATION_ADMIN_ROLE] } },
];

// Normal Routes
const routes: Routes = [
	{ path: '', component: AdministrationComponent, canActivate: [AuthGuard], data: { roles: [KeycloakService.METADATA_ANNOTATION_ADMIN_ROLE] } },
	{ path: 'autocomplete', component: AdministrationAutocompleteComponent, canActivate: [AuthGuard], data: { roles: [KeycloakService.METADATA_ANNOTATION_ADMIN_ROLE] } },
	{ path: 'schemas', component: AdministrationSchemasComponent, canActivate: [AuthGuard], data: { roles: [KeycloakService.METADATA_ANNOTATION_ADMIN_ROLE] } },
	{ path: 'render-options', component: AdministrationRenderOptionsComponent, canActivate: [AuthGuard], data: { roles: [KeycloakService.METADATA_ANNOTATION_ADMIN_ROLE] }, children: detailRoutes },
	...detailRoutes
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthGuard]
})
export class AdministrationRoutingModule { }

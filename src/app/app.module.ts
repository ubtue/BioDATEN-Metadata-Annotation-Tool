import { AuthConfigDevModule } from './auth-config-dev.module';
import { SharedModule } from './modules/shared/shared.module';
import { LoadingScreenComponent } from './modules/shared/components/loading-screen/loading-screen.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
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
import { PlatformModule } from '@angular/cdk/platform';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthConfigModule } from './auth-config.module';
import { DisplayService } from './modules/core/services/display.service';


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
		MatTableModule,
		PlatformModule,
		SharedModule,
		AuthConfigModule,
		// AuthConfigDevModule,
	],
	providers: [
		DataTransferService,
		HeaderComponent,
		LoadingService,
		DisplayService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoadingInterceptor,
			multi: true,
		},
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy
		}
	],
	bootstrap: [AppComponent],
})
export class AppModule { }

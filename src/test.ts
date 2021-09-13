import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { LoadingService } from './app/modules/core/services/loading.service';
import { AppComponent } from './app/app.component';
import { HeaderComponent } from './app/modules/core/components/header/header.component';
import { FooterComponent } from './app/modules/core/components/footer/footer.component';
import { SideNavComponent } from './app/modules/core/components/side-nav/side-nav.component';
import { DataTransferService } from './app/modules/core/services/data-transfer.service';
import { LoadingInterceptor } from './app/modules/core/interceptors/loading.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

declare const require: {
	context(
		path: string,
		deep?: boolean,
		filter?: RegExp
	): {
		keys(): string[];
		<T>(id: string): T;
	};
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting(),
	{ teardown: { destroyAfterEach: true } }
);

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

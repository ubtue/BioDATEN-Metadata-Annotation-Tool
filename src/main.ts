import { LoadingScreenModule } from './app/modules/loading-screen/loading-screen-module';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
	enableProdMode();
}

// Only show the loading wrapper after 500ms
window.setTimeout(
	() => {
		let loadingWrapper = document.getElementById('loading-wrapper') as HTMLElement;

		if ( loadingWrapper ) {
			loadingWrapper.classList.remove('hide');
		}

	}, 500
);

// OUTDATED:
// This is the loading screen module. It will be bootstraped without
// any dependencies, so it will be shown at beginning.
// All other content may have need some time to load (requests etc.)
// After the AppModule is finished loading and bootstraped
// this will no longer be shown
// platformBrowserDynamic().bootstrapModule(LoadingScreenModule)
// 	.catch(err => console.error(err));


// This is the main content of the app
platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));

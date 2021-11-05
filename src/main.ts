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

	}, 1000
);


// This is the main content of the app
platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));

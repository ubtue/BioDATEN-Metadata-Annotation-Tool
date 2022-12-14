import { LoadingService } from './../services/loading.service';
import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpInterceptor,
	HttpResponse,
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
	private totalRequests = 0;
	private totalRequestsFullscreen = 0;


	/**
	 * constructor
	 */
	constructor(private loadingService: LoadingService) {}


	/**
	 * intercept
	 *
	 * Intercepts HttpRequests and modifies the request
	 *
	 * @param request
	 * @param next
	 * @returns
	 */
	intercept(request: HttpRequest<any>, next: HttpHandler) {

		// Skip the intercept?
		if( request.headers.get('skipintercept') ) {
			return next.handle(request);
		}

		// Filter out the token refresh because it should not show a loading screen
		/*TODO is there a better way? */
		if ( request.url.indexOf('openid-connect/token') !== -1 || request.url.indexOf('openid-connect/certs') !== -1 ) {
			return next.handle(request);
		}

		// Keeps track of the number of ongoing requests
		// If the number is higher that 0 a loading screen will be shown
		// If the number is 0 the loading screen will be removed
		this.totalRequests++;
		this.loadingService.setLoading(true);

		return next.handle(request).pipe(
			finalize(() => {
				this.totalRequests--;
				if (this.totalRequests === 0) {
					this.loadingService.setLoading(false);
				}
			})
		);
	}
}

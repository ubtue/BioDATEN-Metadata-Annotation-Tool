import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MetadataPostRequest } from '../../shared/models/metadata-post-request.model';
import { SettingsService } from '../../shared/services/settings.service';

@Injectable({
	providedIn: 'root',
})
export class DataTransferService {

	/**
	 * constructor
	 */
	constructor(private settingsService: SettingsService,
				private httpClient: HttpClient) {}

	/**
	 * getData
	 *
	 * Wraps the get method for http requests
	 *
	 * @param url
	 * @param requestResponseType
	 * @param skipIntercept
	 * @returns
	 */
	getData(url: string, requestResponseType?: string | any, skipIntercept?: boolean): Promise<any> {

		if ( !requestResponseType ) {
			requestResponseType = 'json';
		}

		let httpOpts;


		// Current timestamp as a param
		let timeStampParam: HttpParams = new HttpParams().set('t', Date.now());

		if ( !skipIntercept ) {
			httpOpts = {
				headers: new HttpHeaders()
					.set('Accept', '*/*')
					.set('Content-Type', 'application/json')
					.set('Cache-Control', 'no-cache')
					.set('Pragma', 'no-cache')
					.set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT'),
				responseType: requestResponseType,
				params: timeStampParam
			};
		} else {
			httpOpts = {
				headers: new HttpHeaders().set('Accept', '*/*')
					.set('Content-Type', 'application/json')
					.set('Cache-Control', 'no-cache')
					.set('Pragma', 'no-cache')
					.set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
					.set('skipintercept', 'true'),
				responseType: requestResponseType,
				params: timeStampParam
			};
		}

		return this.httpClient.get(url, httpOpts).toPromise();
	}

	/**
	 * getDataMultiple
	 *
	 * Handles multiple http get requests and returns a single promise after all are complete
	 *
	 * @param urls
	 * @param requestResponseType
	 * @param skipIntercept
	 * @returns
	 */
	getDataMultiple(urls: string[], requestResponseType?: string | any, skipIntercept?: boolean): Promise<any> {

		let promises: Promise<any>[] = [];

		urls.forEach((url: string) => {
			promises.push(this.getData(url, requestResponseType, skipIntercept));
		});

		return Promise.all(promises);
	}

	/**
	 * postData
	 *
	 * Wraps the post method for http requests
	 *
	 * @param url
	 * @param body
	 * @param httpOpts
	 * @returns
	 */
	postData(url: string, body: any, httpOpts?: any): Promise<any> {

		if ( httpOpts ) {
			return this.httpClient.post(url, body, httpOpts).toPromise();
		} else {
			return this.httpClient.post(url, body).toPromise();
		}
	}


	/**
	 * postDataMultiple
	 *
	 * Handles multiple POST requests and returns a single promise once all are completed
	 *
	 * @param data
	 * @param httpOpts
	 * @returns
	 */
	postDataMultiple(data: MetadataPostRequest[], httpOpts?: any): Promise<any> {

		let promises: Promise<any>[] = [];

		// Gather all information and add the post requests to the promise array
		data.forEach((dataSingle: MetadataPostRequest) => {
			promises.push(this.postData(dataSingle.url, dataSingle.body, httpOpts));
		});

		return Promise.all(promises);
	}

	/**
	 * putData
	 *
	 * Wraps the put method for http requests
	 *
	 * @param url
	 * @param body
	 * @param httpOpts
	 * @returns
	 */
	putData(url: string, body: any, httpOpts?: any) {

		if ( httpOpts ) {
			return this.httpClient.put(url, body, httpOpts).toPromise();
		} else {
			return this.httpClient.put(url, body).toPromise();
		}
	}

	/**
	 * deleteData
	 *
	 * Wraps the delete method for http requests
	 *
	 * @param url
	 * @returns
	 */
	deleteData(url:string) {
		return this.httpClient.delete(url).toPromise();
	}
}

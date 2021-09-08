import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MetadataPostRequest } from '../../shared/models/metadata-post-request.model';

@Injectable({
	providedIn: 'root',
})
export class DataTransferService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * getData
	 *
	 * Wraps the get method for http requests
	 *
	 * @param url
	 * @returns Promise
	 */
	getData(url: string, requestResponseType?: string | any): Promise<any> {

		if ( !requestResponseType ) {
			requestResponseType = 'json';
		}

		const httpOpts = {
			headers: new HttpHeaders().set('Accept', 'text/html').set('Content-Type', 'application/json'),
			responseType: requestResponseType
		};

		return this.httpClient.get(url, httpOpts).toPromise();
	}

	/**
	 * getDataMultiple
	 *
	 * Handles multiple http get requests and returns a single promise after all are complete
	 *
	 * @param urls
	 * @param requestResponseType
	 * @returns
	 */
	getDataMultiple(urls: string[], requestResponseType?: string | any): Promise<any> {

		let promises: Promise<any>[] = [];

		urls.forEach((url: string) => {
			promises.push(this.getData(url, requestResponseType));
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
	 * handles multiple POST requests and returns a single promise once all are completed
	 *
	 * @param data
	 * @param httpOpts
	 * @returns
	 */
	postDataMultiple(data: MetadataPostRequest[], httpOpts?: any): Promise<any> {

		let promises: Promise<any>[] = [];

		// gather all information and add the post requests to the promise array
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
	 * @returns
	 */
	putData(url: string, body: any) {
		return this.httpClient.put(url, body).toPromise();
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

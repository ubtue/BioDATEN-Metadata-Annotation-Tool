import { UpdateNavigationService } from './../../../../core/services/update-navigation.service';
import { RenderOptionsService } from 'src/app/modules/shared/services/render-options.service';
import { RenderOption } from './../../../../shared/models/render-option.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
	selector: 'app-administration-render-options-details',
	templateUrl: './administration-render-options-details.component.html',
	styleUrls: ['./administration-render-options-details.component.scss']
})
export class AdministrationRenderOptionsDetailsComponent implements OnInit, OnDestroy {

	private routeSub: Subscription = new Subscription;

	currentRenderOptionId: string = '';
	currentRenderOption: RenderOption = {} as any;

	/**
	 * constructor
	 */
	constructor(private route: ActivatedRoute,
				private renderOptionsService: RenderOptionsService,
				private updateNavigationService: UpdateNavigationService) { }


	/**
	 * ngOnInit
	 */
	ngOnInit(): void {

		// Get the route params
		this.routeSub = this.route.params.subscribe(params => {

			// Get the ID
			if ( params['id'] ) {
				this.currentRenderOptionId = params['id'];

				// If there is an ID get the data
				this.renderOptionsService.getSingleRenderOption(this.currentRenderOptionId).then(
					(renderOption: RenderOption) => {
						this.currentRenderOption = renderOption;

						// Change the navigation title
						this.updateNavigationService.updateCurrentView("Administration:", "Render Option for xpath: " + renderOption.xpath);
					}
				);
			}
		});
	}

	/**
	 * ngOnDestroy
	 */
	ngOnDestroy() {

		// Unsubscribe to the route subscription
		this.routeSub.unsubscribe();
	}
}

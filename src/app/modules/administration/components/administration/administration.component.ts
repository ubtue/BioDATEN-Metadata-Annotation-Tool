import { UpdateNavigationService } from 'src/app/modules/core/services/update-navigation.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-administration',
	templateUrl: './administration.component.html',
	styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

	constructor(private updateNavigationService: UpdateNavigationService) { }

	ngOnInit(): void {
		this.updateNavigationService.updateCurrentView("Administration:", "Overview");
	}

}

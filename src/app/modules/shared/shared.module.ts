import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/alert/alert.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { NgModule } from '@angular/core';
import { BackLinkComponent } from './components/back-link/back-link.component';

@NgModule({
	declarations: [
		LoadingScreenComponent,
		AlertComponent,
  		BackLinkComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		RouterModule
	],
	exports: [
		LoadingScreenComponent,
		AlertComponent,
		BackLinkComponent
	]
})
export class SharedModule {}

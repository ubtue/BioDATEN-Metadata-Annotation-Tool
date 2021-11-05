import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/alert/alert.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { NgModule } from '@angular/core';

@NgModule({
	declarations: [
		LoadingScreenComponent,
		AlertComponent
	],
	imports: [
		CommonModule,
		MatIconModule
	],
	exports: [
		LoadingScreenComponent,
		AlertComponent
	]
})
export class SharedModule {}

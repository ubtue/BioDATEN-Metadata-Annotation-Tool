import { BrowserModule } from '@angular/platform-browser';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [
		LoadingScreenComponent
	],
	exports: [LoadingScreenComponent],
	imports: [CommonModule],
	bootstrap: [LoadingScreenComponent],
})
export class LoadingScreenModule {}

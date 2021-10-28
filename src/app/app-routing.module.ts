import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'annotation',
		loadChildren: () =>
			import(
				'./modules/metadata-annotation-form/metadata-annotation-form.module'
			).then((m) => m.MetadataAnnotationFormModule),
	},
	{
		path: 'user',
		loadChildren: () =>
			import(
				'./modules/user/user.module'
			).then((m) => m.UserModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}

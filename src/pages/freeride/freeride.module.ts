import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreeridePage } from './freeride';

@NgModule({
	declarations: [
		FreeridePage
	],
	imports: [
		IonicPageModule.forChild(FreeridePage)
	],
	entryComponents: [
		FreeridePage
	]
})
export class FreeridePageModule {}

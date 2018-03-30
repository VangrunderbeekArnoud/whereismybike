import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntrancePage } from './entrance';

@NgModule({
	declarations: [
		EntrancePage
	],
	imports: [
		IonicPageModule.forChild(EntrancePage)
	],
	entryComponents: [
		EntrancePage
	]
})
export class EntrancePageModule {}

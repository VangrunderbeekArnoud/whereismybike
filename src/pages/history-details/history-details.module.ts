import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryDetailsPage } from './history-details';
@NgModule({
	declarations: [
		HistoryDetailsPage
	],
	imports: [
		IonicPageModule.forChild(HistoryDetailsPage)
	],
	entryComponents: [
		HistoryDetailsPage
	]
})
export class HistoryDetailsPageModule { }
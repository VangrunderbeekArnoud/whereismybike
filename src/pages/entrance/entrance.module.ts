import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntrancePage } from './entrance';
import {TranslateModule} from "ng2-translate";

@NgModule({
	declarations: [
		EntrancePage
	],
	imports: [
		IonicPageModule.forChild(EntrancePage),
    TranslateModule
	],
	entryComponents: [
		EntrancePage
	]
})
export class EntrancePageModule {}

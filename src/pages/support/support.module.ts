import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupportPage } from './support';
import {TranslateModule} from "ng2-translate";
@NgModule({
	declarations: [
		SupportPage
	],
	imports: [
		IonicPageModule.forChild(SupportPage),
    TranslateModule
	],
	entryComponents: [
		SupportPage
	]
})
export class SupportPageModule { }

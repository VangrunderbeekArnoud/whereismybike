import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhonePage } from './phone';
import {TranslateModule} from "ng2-translate";
@NgModule({
	declarations: [
		PhonePage
	],
	imports: [
		IonicPageModule.forChild(PhonePage),
    TranslateModule
	],
	entryComponents: [
		PhonePage
	]
})
export class PhonePageModule { }

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import {TranslateModule} from "ng2-translate";
@NgModule({
	declarations: [
		SignupPage
	],
	imports: [
		IonicPageModule.forChild(SignupPage),
    TranslateModule
	],
	entryComponents: [
		SignupPage
	]
})
export class SignupPageModule { }

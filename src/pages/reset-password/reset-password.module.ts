import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetPasswordPage } from './reset-password';
import {TranslateModule} from "ng2-translate";
@NgModule({
	declarations: [
		ResetPasswordPage
	],
	imports: [
		IonicPageModule.forChild(ResetPasswordPage),
    TranslateModule
	],
	entryComponents: [
		ResetPasswordPage
	]
})
export class ResetPasswordPageModule { }

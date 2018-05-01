import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import {TranslateModule} from "ng2-translate";
@NgModule({
	declarations: [
		LoginPage
	],
	imports: [
		IonicPageModule.forChild(LoginPage),
    TranslateModule
	],
	entryComponents: [
		LoginPage
	]
})
export class LoginPageModule { }

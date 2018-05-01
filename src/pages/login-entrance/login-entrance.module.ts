import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginEntrancePage } from './login-entrance';
import {TranslateModule} from "ng2-translate";

@NgModule({
	declarations: [
		LoginEntrancePage
	],
	imports: [
		IonicPageModule.forChild(LoginEntrancePage),
    TranslateModule
	],
	entryComponents: [
		LoginEntrancePage
	]
})
export class LoginEntrancePageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import {TranslateModule} from "ng2-translate";
@NgModule({
	declarations: [
		ProfilePage
	],
	imports: [
		IonicPageModule.forChild(ProfilePage),
    TranslateModule
	],
	entryComponents: [
		ProfilePage
	]
})
export class ProfilePageModule { }

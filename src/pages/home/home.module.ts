import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {TranslateModule} from "ng2-translate";
@NgModule({
	declarations: [
		HomePage
	],
	imports: [
		IonicPageModule.forChild(HomePage),
    TranslateModule
	],
	entryComponents: [
		HomePage
	]
})
export class HomePageModule { }

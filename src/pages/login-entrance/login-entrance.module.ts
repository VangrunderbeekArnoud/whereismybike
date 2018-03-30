import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginEntrancePage } from './login-entrance';

@NgModule({
	declarations: [
		LoginEntrancePage
	],
	imports: [
		IonicPageModule.forChild(LoginEntrancePage)
	],
	entryComponents: [
		LoginEntrancePage
	]
})
export class LoginEntrancePageModule {}

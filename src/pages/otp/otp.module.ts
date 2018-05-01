import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtpPage } from './otp';
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    OtpPage,
  ],
  imports: [
    IonicPageModule.forChild(OtpPage),
    TranslateModule
  ],
})
export class OtpPageModule {}

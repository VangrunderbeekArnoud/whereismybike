import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyPage } from './privacy';
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    PrivacyPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacyPage),
    TranslateModule
  ],
})
export class PrivacyPageModule {}

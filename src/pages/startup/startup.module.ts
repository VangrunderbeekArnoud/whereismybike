import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartupPage } from './startup';
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    StartupPage,
  ],
  imports: [
    IonicPageModule.forChild(StartupPage),
    TranslateModule
  ],
})
export class StartupPageModule {}

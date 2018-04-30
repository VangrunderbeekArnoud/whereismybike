import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevicesPage } from './devices';
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    DevicesPage,
  ],
  imports: [
    IonicPageModule.forChild(DevicesPage),
    TranslateModule
  ],
})
export class DevicesPageModule {}

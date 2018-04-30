import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDevicePage } from './add-device';
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    AddDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(AddDevicePage),
    TranslateModule
  ],
})
export class AddDevicePageModule {}

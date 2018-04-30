import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditDevicePage } from './edit-device';
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    EditDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(EditDevicePage),
    TranslateModule
  ],
})
export class EditDevicePageModule {}

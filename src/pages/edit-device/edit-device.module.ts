import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditDevicePage } from './edit-device';

@NgModule({
  declarations: [
    EditDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(EditDevicePage),
  ],
})
export class EditDevicePageModule {}

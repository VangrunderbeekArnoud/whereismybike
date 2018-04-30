import { NgModule } from '@angular/core';
import { IonicPageModule , Platform} from 'ionic-angular';
import { LanguagePage } from './language';
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    LanguagePage,
  ],
  imports: [
    IonicPageModule.forChild(LanguagePage),
    TranslateModule
  ],
})
export class LanguagePageModule { }




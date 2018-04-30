import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SigfoxProvider, VirtualSigfoxProvider} from "../../providers/sigfox/sigfox";
import {ProfileProvider} from "../../providers/profile/profile";
import { availableLanguages, sysOptions } from './language.constants';
import { TranslateService } from 'ng2-translate';

/**
 * Generated class for the LanguagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {

  languages = availableLanguages;
  selectedLanguage = sysOptions.systemLanguage;

  param = { value: 'world' };

  private translate: TranslateService;

  constructor(translate: TranslateService) {
    this.translate = translate;

  }

  applyLanguage() {
    this.translate.use(this.selectedLanguage);
  }
}

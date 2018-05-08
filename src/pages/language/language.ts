import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';
import { LanguageProvider} from "../../providers/language/language";
import { TranslateService } from 'ng2-translate';
import {AnalyticsProvider} from "../../providers/analytics/analytics";

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

  languages = this.language.availableLanguages;
  selectedLanguage = this.language.sysOptions.systemLanguage;

  param = { value: 'world' };

  private translate: TranslateService;

  constructor(translate: TranslateService, private language: LanguageProvider,
              private analytics: AnalyticsProvider) {
    this.translate = translate;
  }
  ionViewDidEnter() {
    this.analytics.page('LanguagePage');
  }
  applyLanguage() {
    this.language.set(this.selectedLanguage);
  }
}

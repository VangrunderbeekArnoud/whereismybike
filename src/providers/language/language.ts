import {Injectable, NgModule} from '@angular/core';
import { Platform} from 'ionic-angular';
import {TranslateModule, TranslateService} from 'ng2-translate';
import { Globalization} from '@ionic-native/globalization';


@Injectable()
export class LanguageProvider {

  public availableLanguages = [{
    code: 'nl',
    name: 'Nederlands'
  }];

  public defaultLanguage = 'nl';
  public sysOptions = {
    systemLanguage: this.defaultLanguage
  };

  constructor(platform: Platform, private translate: TranslateService, private globalization: Globalization) {
    console.log('language provider loaded !');
    platform.ready().then(() => {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang(this.defaultLanguage);

        if ((<any>window).cordova) {
          globalization.getPreferredLanguage().then(result => {
            var language = this.getSuitableLanguage(result.value);
            translate.use(language);
            this.sysOptions.systemLanguage = language;
          });
        } else {
          let browserLanguage = translate.getBrowserLang() || this.defaultLanguage;
          var language = this.getSuitableLanguage(browserLanguage);
          translate.use(language);
          this.sysOptions.systemLanguage = language;
        }
      translate.use('nl');
      this.sysOptions.systemLanguage = 'nl';
      }
    );
  }

  private getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    return this.availableLanguages.some(x => x.code == language) ? language : this.defaultLanguage;
  }

}

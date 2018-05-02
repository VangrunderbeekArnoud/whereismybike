import {Injectable} from '@angular/core';
import { Platform} from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Globalization} from '@ionic-native/globalization';
import { Storage} from '@ionic/storage';


@Injectable()
export class LanguageProvider {

  public availableLanguages = [{
    code: 'nl',
    name: 'Nederlands'
  }, {
    code: 'en',
    name: 'English'
  }];

  public defaultLanguage = 'nl';
  public sysOptions = {
    systemLanguage: this.defaultLanguage
  };

  constructor(platform: Platform, private translate: TranslateService,
              private globalization: Globalization, private storage: Storage) {
    console.log('language provider loaded !');
    platform.ready().then(() => {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang(this.defaultLanguage);
        this.storage.ready().then(() => {
          this.storage.get('language').then(dblang => {
            if ( !dblang) { // if no language is set
              if ((<any>window).cordova) {
                globalization.getPreferredLanguage().then(result => {
                  console.log('setLanguage: syslanguage');
                  this.set(result.value);
                });
              } else {
                let browserLanguage = translate.getBrowserLang() || this.defaultLanguage;
                this.set(browserLanguage);
              }
            } else { // if a language is set
              this.set(dblang);
            }
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      }
    );
  }
  set(language) {
    language = this.getSuitableLanguage(language);
    this.translate.use(language);
    this.sysOptions.systemLanguage = language;
    this.storage.set('language', language).catch(err => console.log(err));
  }
  private getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    return this.availableLanguages.some(x => x.code == language) ? language : this.defaultLanguage;
  }

}

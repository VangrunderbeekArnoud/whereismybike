import {Injectable, NgModule} from '@angular/core';
import { Platform} from 'ionic-angular';
import {TranslateModule, TranslateService} from 'ng2-translate';
import { Globalization} from '@ionic-native/globalization';


@Injectable()
export class LanguageProvider {

  public availableLanguages = [{
    code: 'en',
    name: 'English'
  }, {
    code: 'nl',
    name: 'Nederlands'
  }];

  public defaultLanguage = 'en';
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
      this.load();
      }
    );
  }
  public Name: string;
  public ChooseFrom: string;
  public Camera: string;
  public File: string;
  public Cancel: string;
  public ProcessingImg: string;
  public Save: string;
  public DeviceID: string;
  public DeviceExist: string;
  public Brand: string;
  public Type: string;
  public EngrNr: string;
  public ValidID: string;
  public Retrieving: string;
  public Yes: string;
  public Logout: string;
  public Phone: string;
  public DeleteDevice: string;
  public load() {
    this.translate.get('Delete device').subscribe((res: string) => {
      this.DeleteDevice = res;
    });
    this.translate.get('Yes').subscribe((res: string) => {
      this.Yes = res;
    });
    this.translate.get('Are you sure to logout?').subscribe((res: string) => {
      this.Logout = res;
    });
    this.translate.get('Phone').subscribe((res: string) => {
      this.Phone = res;
    });
    this.translate.get('Name').subscribe((res: string) => {
      this.Name = res;
    });
    this.translate.get('Choose from').subscribe((res: string) => {
      this.ChooseFrom = res;
    });
    this.translate.get('Camera').subscribe((res: string) => {
      this.Camera = res;
    });
    this.translate.get('File').subscribe((res: string) => {
      this.File = res;
    });
    this.translate.get('Cancel').subscribe((res: string) => {
      this.Cancel = res;
    });
    this.translate.get('Processing image').subscribe((res: string) => {
      this.ProcessingImg = res;
    });
    this.translate.get('Save').subscribe((res: string) => {
      this.Save = res;
    });
    this.translate.get('Device ID').subscribe((res: string) => {
      this.DeviceID = res;
    });
    this.translate.get('Device already exists!').subscribe((res: string) => {
      this.DeviceExist = res;
    });
    this.translate.get('Brand').subscribe((res: string) => {
      this.Brand = res;
    });
    this.translate.get('Type').subscribe((res: string) => {
      this.Type = res;
    });
    this.translate.get('Engravings nr').subscribe((res: string) => {
      this.EngrNr = res;
    });
    this.translate.get('Please enter a valid device ID').subscribe((res: string) => {
      this.ValidID = res;
    });
    this.translate.get('Retrieving all items').subscribe((res: string) => {
      this.Retrieving = res;
    });
  }

  private getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    return this.availableLanguages.some(x => x.code == language) ? language : this.defaultLanguage;
  }

}

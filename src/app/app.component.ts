import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, LoadingController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AuthProvider} from '../providers/auth/auth';
import {ProfileProvider} from '../providers/profile/profile';
import {OneSignal} from '@ionic-native/onesignal';
import {NativeMapContainerProvider} from '../providers/native-map-container/native-map-container';
import {LanguageProvider} from "../providers/language/language";
import {TranslateService} from 'ng2-translate';
import {NetworkProvider} from "../providers/network/network";

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  public user: any;
  @ViewChild(Nav) nav: Nav;
  // public fireAuth:firebase.auth.Auth;

  //for the purpose of effective lazy loading of pages make your rootPage directed at homepage.
  public rootPage: any = 'HomePage';
  public appName: string = 'DEMO APP';
  public userProfile: any;
  phone: any;
  pages: Array<{ title: string, component: any, icon: string }>
  private translate: TranslateService;

  constructor(translate: TranslateService, private language: LanguageProvider,
              private cMap: NativeMapContainerProvider, public loadingCtrl: LoadingController,
              private One: OneSignal, public ph: ProfileProvider,
              public auth: AuthProvider, public platform: Platform,
              public statusBar: StatusBar, public splashScreen: SplashScreen, private network: NetworkProvider) {
    //Initialize
    this.initializeApp();
    this.translate = translate;
    this.pages = [
      //Add pages for sidemenu
      {title: 'DEVICES', component: 'DevicesPage', icon: 'md-bicycle'},
      {title: 'SUPPORT', component: 'SupportPage', icon: "ios-help-circle"},
      {title: 'LANGUAGE', component: 'LanguagePage', icon: 'md-globe'}
    ];

  }

  initializeApp() {
    ///initialize onesignal notification here
    this.platform.ready().then(() => {
      console.log('initializeApp');
      //Replace with your app id and google cloud messaging id from https://onesignal.com
      this.One.startInit("cafd3aeb-1e83-4c1b-9d98-04768038324f", "1026466723913");
      this.One.inFocusDisplaying(this.One.OSInFocusDisplayOption.Notification);
      this.One.setSubscription(true);
      this.One.endInit();
      //this.statusBar.styleDefault();
      //this.statusBar.backgroundColorByHexString("#131313");

      this.statusBar.show();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 500);

      // }
    });
  }
  openPage(page) {
    //open side menu pages on click
    this.nav.push(page.component);
  }
  gotoProfile() {
    //open top menu from side bar menu
    this.nav.push('ProfilePage');
  }

}

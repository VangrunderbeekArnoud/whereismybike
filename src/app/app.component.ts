import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav, Loading, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { ProfileProvider } from '../providers/profile/profile';
import { OneSignal} from '@ionic-native/onesignal';
import { NativeMapContainerProvider } from '../providers/native-map-container/native-map-container';


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
    pages: Array<{title: string, component: any, icon: string}>

  constructor(public zone: NgZone, private cMap: NativeMapContainerProvider,  public loadingCtrl: LoadingController, private One: OneSignal, public ph: ProfileProvider, public auth: AuthProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    //Initialize
    this.initializeApp()

    this.pages = [
      //Add pages for sidemenu
      //{ title: 'History', component: 'HistoryPage', icon: "ios-clock" },
      //{ title: 'Payment', component: 'PaymentPage', icon: "ios-card" },
      //{ title: 'Promotion', component: 'PromoPage', icon: "ios-trophy" },
      { title: 'Devices', component: 'DevicesPage', icon: 'md-bicycle'},
      { title: 'Support', component: 'SupportPage', icon: "ios-help-circle" },
      { title: 'Language', component: 'LanguagePage', icon: 'md-globe'}
      //{ title: 'FreeRides', component: 'FreeridePage', icon: "ios-star-outline" },
      //{ title: 'About', component: 'AboutPage', icon: "ios-information-circle" },
    ];

  }




  initializeApp(){

    ///initialize onesignal notification here
    this.platform.ready().then(() => {

     //Replace with your app id and google cloud messaging id from https://onesignal.com
      this.One.startInit("cafd3aeb-1e83-4c1b-9d98-04768038324f", "1026466723913");
      this.One.inFocusDisplaying(this.One.OSInFocusDisplayOption.Notification);
      this.One.setSubscription(true);
      this.One.endInit();
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#131313");
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

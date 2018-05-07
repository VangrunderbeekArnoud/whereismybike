//native modules
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { Vibration } from '@ionic-native/vibration';
import { BrowserTab} from '@ionic-native/browser-tab';
import { Firebase} from '@ionic-native/firebase';
import { GoogleMaps} from '@ionic-native/google-maps';
import * as firebase from 'firebase/app'
import { OneSignal} from '@ionic-native/onesignal';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CallNumber } from '@ionic-native/call-number';
import { TranslateModule} from 'ng2-translate/ng2-translate';
import { TranslateLoader, TranslateStaticLoader} from 'ng2-translate/src/translate.service';
import { Http} from '@angular/http';
import { Globalization} from '@ionic-native/globalization';
import { Network} from '@ionic-native/network';
//other
import { MyApp } from './app.component';

//providers
import { AuthProvider } from '../providers/auth/auth';
import { ProfileProvider } from '../providers/profile/profile';
import { GeocoderProvider } from '../providers/geocoder/geocoder';
import { PopUpProvider } from '../providers/pop-up/pop-up';
import { OnesignalProvider } from '../providers/onesignal/onesignal';
import { NativeMapContainerProvider } from '../providers/native-map-container/native-map-container';
import { SigfoxProvider, VirtualSigfoxProvider } from "../providers/sigfox/sigfox";
import { LanguageProvider} from "../providers/language/language";
import { MyErrorHandler } from '../providers/my-error-handler/my-error-handler';

export function createTranslateLoader( http: Http) {
  return new TranslateStaticLoader(http, 'assets/languages', '.json');
}

//Change this to your firebase configuration file gotten from https://console.firebase.google.com
export const firebaseConfig = {
  apiKey: "AIzaSyAakweFfpnap3rDFN2ok0nV4ufmLWGM7CQ",
  authDomain: "whereismybike-b044e.firebaseapp.com",
  databaseURL: "https://whereismybike-b044e.firebaseio.com",
  projectId: "whereismybike-b044e",
  storageBucket: "whereismybike-b044e.appspot.com",
  messagingSenderId: "1026466723913"
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    BrowserModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: MyErrorHandler},
    AuthProvider,
    ProfileProvider,
    BrowserTab,
    Camera,
    GeocoderProvider,
    PopUpProvider,
    OnesignalProvider,
    OneSignal,
    InAppBrowser,
    CallNumber,
    Firebase,
    NativeMapContainerProvider,
    GoogleMaps,
    Vibration,
    SigfoxProvider,
    VirtualSigfoxProvider,
    Globalization,
    LanguageProvider,
    Network,
    MyErrorHandler
  ]
})
export class AppModule {}

//native modules
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { BackgroundMode } from '@ionic-native/background-mode';
import { CardIO } from '@ionic-native/card-io';
import { Stripe } from '@ionic-native/stripe';
import { DatePicker } from '@ionic-native/date-picker';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HttpModule } from '@angular/http';
import { Facebook } from '@ionic-native/facebook';
import { Vibration } from '@ionic-native/vibration';
import { BrowserTab} from '@ionic-native/browser-tab';
import { Firebase} from '@ionic-native/firebase';
import { GoogleMaps} from '@ionic-native/google-maps';
import * as firebase from 'firebase/app'
import { OneSignal} from '@ionic-native/onesignal';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CallNumber } from '@ionic-native/call-number';
import { Ionic2RatingModule } from 'ionic2-rating';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
//other
import { MyApp } from './app.component';

//providers
import { AuthProvider } from '../providers/auth/auth';
import { EventProvider } from '../providers/event/event';
import { ProfileProvider } from '../providers/profile/profile';
import { RatePage } from '../pages/rate/rate';
import { GeocoderProvider } from '../providers/geocoder/geocoder';
import { DirectionserviceProvider } from '../providers/directionservice/directionservice';
import { PopUpProvider } from '../providers/pop-up/pop-up';
import { OnesignalProvider } from '../providers/onesignal/onesignal';
import { NativeMapContainerProvider } from '../providers/native-map-container/native-map-container';
import { ApiProvider } from '../providers/api/api';
import { SigfoxProvider } from "../providers/sigfox/sigfox";


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
    RatePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule,
    IonicStorageModule.forRoot(),
    BrowserModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RatePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    EventProvider,
    ProfileProvider,
    CardIO,
    BrowserTab,
    ImagePicker,
    Camera,
    Facebook,
    GeocoderProvider,
    DirectionserviceProvider,
    PopUpProvider,
    OnesignalProvider,
    BackgroundMode,
    OneSignal,
    DatePicker,
    LocalNotifications,
    InAppBrowser,
    CallNumber,
    Firebase,
    Stripe,
    PayPal,
    RatePage,
    NativeMapContainerProvider,
    GoogleMaps,
    Vibration,
    ApiProvider,
    SigfoxProvider
  ]
})
export class AppModule {}

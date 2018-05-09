import { Injectable } from '@angular/core';
import { Firebase} from '@ionic-native/firebase';
import {Platform} from "ionic-angular";
import {ProfileProvider} from "../profile/profile";

@Injectable()
export class AnalyticsProvider {

  constructor(private firebase: Firebase, private platform: Platform,
              private ph: ProfileProvider) {
    console.log('AnalyticsProvider');
    platform.ready().then(() => {
      if ( platform.is('cordova')) {
        firebase.setUserId(this.ph.user.uid);
        firebase.setAnalyticsCollectionEnabled(true);
      }
    });
  }
  event(type: string, data: any) {
    if ( this.platform.is('cordova')) {
      this.firebase.logEvent(type, data)
        .catch(err => console.log(err));
    }
  }
  page(name: string) {
    if ( this.platform.is('cordova')) {
      this.firebase.setScreenName(name)
        .catch(err => console.log(err));
    }
  }

}

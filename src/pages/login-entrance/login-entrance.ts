import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {ProfileProvider} from "../../providers/profile/profile";

@IonicPage()
@Component({
  selector: 'page-login-entrance',
  templateUrl: 'login-entrance.html',
})
export class LoginEntrancePage {


  constructor(public navCtrl: NavController, public load: LoadingController,
              private analytics: AnalyticsProvider, private ph: ProfileProvider) {
  }
  ionViewDidEnter() {
    this.analytics.page('LoginEntrancePage');
  }
  ionViewDidLoad() {
    this.presentRouteLoader()
  }
presentRouteLoader() {
  let myTimeout = setTimeout(() => {
   this.navCtrl.setRoot('LoginPage')
    clearTimeout(myTimeout)

  }, 2500);
}

}

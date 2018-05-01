import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';
import {TranslateService} from "ng2-translate";

@IonicPage()
@Component({
  selector: 'page-login-entrance',
  templateUrl: 'login-entrance.html',
})
export class LoginEntrancePage {


  constructor(public navCtrl: NavController, public load: LoadingController,
              public navParams: NavParams, private translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartupPage');
    this.presentRouteLoader()
  }


presentRouteLoader() {

  let myTimeout = setTimeout(() => {

   this.navCtrl.setRoot('LoginPage')
    clearTimeout(myTimeout)

  }, 2500);
}

}

import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login-entrance',
  templateUrl: 'login-entrance.html',
})
export class LoginEntrancePage {


  constructor(public navCtrl: NavController, public load: LoadingController,  public navParams: NavParams) {
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

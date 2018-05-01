import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, NavParams } from 'ionic-angular';
import {TranslateService} from "ng2-translate";
/**
 * Generated class for the StartupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-startup',
  templateUrl: 'startup.html',
})
export class StartupPage {

  constructor(public navCtrl: NavController, public load: LoadingController,
              public navParams: NavParams, private translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartupPage');
    this.translate.get('WAIT').subscribe(translation => {
      this.presentRouteLoader(translation);
    });
  }


presentRouteLoader(message) {
  let loading = this.load.create({
    content: message
  });

  loading.present();

  let myInterval = setInterval(() => {
    loading.dismiss();
   this.navCtrl.setRoot('PhonePage')
    clearInterval(myInterval)

  }, 1000);
}

}

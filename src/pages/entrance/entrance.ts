import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import {TranslateService} from "ng2-translate";
import {AnalyticsProvider} from "../../providers/analytics/analytics";

/**
 * Generated class for the EntrancePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entrance',
  templateUrl: 'entrance.html',
})
export class EntrancePage {

  constructor(public navCtrl: NavController, public load: LoadingController,
              private translate: TranslateService, private analytics: AnalyticsProvider) {
  }
  ionViewDidLoad() {
    this.translate.get('WAIT').subscribe(translation => {
      this.presentRouteLoader(translation);
    });
  }
  ionViewDidEnter() {
    this.analytics.page('EntrancePage');
  }

presentRouteLoader(message) {
  let loading = this.load.create({
    content: message
  });

  loading.present();

  let myTimeout = setTimeout(() => {
    loading.dismiss();
   this.navCtrl.setRoot('SignupPage')
    clearTimeout(myTimeout)

  }, 1000);
}

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SigfoxProvider} from "../../providers/sigfox/sigfox";

/**
 * Generated class for the LanguagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {
  public locations: any

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public sigfox: SigfoxProvider) {
  }

  ionViewDidEnter() {
    this.sigfox.getDevices().on('child_added', snapshot => {
      this.locations = [snapshot.val().location.gps.lat, snapshot.val().location.gps.lng];
      console.log('the locations values');
      console.log(this.locations[0]);
      console.log(this.locations[1]);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePage');
  }

}

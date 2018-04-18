import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SigfoxProvider, VirtualSigfoxProvider} from "../../providers/sigfox/sigfox";
import {ProfileProvider} from "../../providers/profile/profile";

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
              public sigfox: SigfoxProvider, public ph: ProfileProvider, public vsp: VirtualSigfoxProvider) {
  }

  ionViewDidEnter() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePage');
  }

}

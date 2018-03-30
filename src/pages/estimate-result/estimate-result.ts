import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the EstimateResultPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-estimate-result',
  templateUrl: 'estimate-result.html',
})
export class EstimateResultPage {
  charge: string = this.navParams.get('charge');
  constructor(public navCtrl: NavController,  public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EstimateResultPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }


}

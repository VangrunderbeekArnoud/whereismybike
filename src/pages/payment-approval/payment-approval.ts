import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PopUpProvider } from '../../providers/pop-up/pop-up';

/**
 * Generated class for the PaymentApprovalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-approval',
  templateUrl: 'payment-approval.html',
})
export class PaymentApprovalPage {
  from: string = this.navParams.get('from');
  to: string = this.navParams.get('to');
  charge: string = this.navParams.get('charge');

  constructor(public navCtrl: NavController,  public viewCtrl: ViewController, public pop: PopUpProvider, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentApprovalPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}

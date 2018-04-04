import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
const newLocal = 'YourPhoneNumberHere';
import { PopUpProvider } from '../../providers/pop-up/pop-up';
import { ProfileProvider } from '../../providers/profile/profile';
const newLocal_1 = 'YourEmailHere';

@IonicPage()
/**
 * Generated class for the SupportPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
  todo: any = {
    description: ''
  }
  constructor(public navCtrl: NavController, public pop: PopUpProvider, public prof: ProfileProvider, public navParams: NavParams, public call: CallNumber) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportPage');
  }

  callNow(){
   // window.open("tel:" + newLocal);
    this.call.callNumber(newLocal, true)
  }





logForm() {

    this.prof.Complain(this.todo.description).then(suc =>{
this.pop.showPimp('Your complain has been submitted, we will get back to you as soon as possible via e-mail.')
    })

  }

}

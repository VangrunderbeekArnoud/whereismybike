import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopUpProvider } from '../../providers/pop-up/pop-up';
/**
 * Generated class for the FreeridePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freeride',
  templateUrl: 'freeride.html',
})
export class FreeridePage {

  constructor(public navCtrl: NavController, public pop:PopUpProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreeridePage');
  }


 Show(){
   this.pop.showAlert('Not Available Yet', 'We are working on this')
 }

}

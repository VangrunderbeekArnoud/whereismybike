import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { PopUpProvider } from '../../providers/pop-up/pop-up';
import { ProfileProvider } from '../../providers/profile/profile';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { BrowserTab } from "@ionic-native/browser-tab";
import {TranslateService} from "ng2-translate";

const newLocal = 'YourPhoneNumberHere';
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
  constructor( public browsertab: BrowserTab, public iab: InAppBrowser,
               public pop: PopUpProvider, public prof: ProfileProvider,
               public call: CallNumber, private translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportPage');
  }

  callNow(){
   // window.open("tel:" + newLocal);
    this.call.callNumber(newLocal, true)
  }

  goToSite(){
    //const browser = this.iab.create('http://startware.tech/');
    this.browsertab.openUrl('http://startware.tech/').then(suc=>{
      console.log('hurray!! it works')
    })
  }

  goToSiteFAQ(){
    //const browser = this.iab.create('http://startware.tech/');
    this.browsertab.openUrl('http://startware.tech/').then(suc=>{
      console.log('hurray!! it works')
    })
  }

logForm() {
    this.prof.Complain(this.todo.description).then(suc =>{
      this.translate.get('FEEDBACK_SUBMITTED').subscribe(translation => {
        this.pop.showPimp(translation);
      });
    })

  }

}

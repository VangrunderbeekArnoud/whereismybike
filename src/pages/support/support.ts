import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {PopUpProvider} from '../../providers/pop-up/pop-up';
import {ProfileProvider} from '../../providers/profile/profile';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {BrowserTab} from "@ionic-native/browser-tab";
import {TranslateService} from "ng2-translate";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {NetworkProvider} from "../../providers/network/network";

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

  constructor(public browsertab: BrowserTab, public iab: InAppBrowser,
              public pop: PopUpProvider, public prof: ProfileProvider,
              private translate: TranslateService,
              private analytics: AnalyticsProvider, private network: NetworkProvider) {
  }

  ionViewDidEnter() {
    this.analytics.page('SupportPage');
  }
  goToSite() {
    //const browser = this.iab.create('http://startware.tech/');
    this.analytics.event('website_visit', {foo: 'bar'});
    if (this.network.connected) {
      this.browsertab.openUrl('http://startware.tech/').then(suc => {
        console.log('hurray!! it works')
      });
    } else {
      this.translate.get('NO_NETWORK').subscribe(translation => {
        this.pop.presentToast(translation);
      });
    }
  }

  goToSiteFAQ() {
    //const browser = this.iab.create('http://startware.tech/');
    this.analytics.event('faq_visit', {foo: 'bar'});
    if (this.network.connected) {
      this.browsertab.openUrl('http://startware.tech/').then(suc => {
        console.log('hurray!! it works')
      });
    } else {
      this.translate.get('NO_NETWORK').subscribe(translation => {
        this.pop.presentToast(translation);
      });
    }
  }

  logForm() {
    this.analytics.event('user_feedback', {foo: 'bar'});
    if (this.network.connected) {
      this.prof.Complain(this.todo.description).then(suc => {
        this.translate.get('FEEDBACK_SUBMITTED').subscribe(translation => {
          this.pop.showPimp(translation);
        });
      });
      document.getElementById("myInput").innerText = '';
    } else {
      this.translate.get('NO_NETWORK').subscribe(translation => {
        this.pop.presentToast(translation);
      });
    }
  }

}

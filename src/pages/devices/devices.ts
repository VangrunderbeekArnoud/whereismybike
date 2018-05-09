import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {ProfileProvider} from "../../providers/profile/profile";
import {PopUpProvider} from "../../providers/pop-up/pop-up";
import {TranslateService} from "ng2-translate";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {NetworkProvider} from "../../providers/network/network";

@IonicPage()
@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html',
})
export class DevicesPage {
  public devices: Array<any>;

  constructor(public navCtrl: NavController, public ph: ProfileProvider,
              public pop: PopUpProvider, private translate: TranslateService,
              private analytics: AnalyticsProvider, private network: NetworkProvider) { }
  ionViewDidEnter() {
    this.analytics.page('DevicesPage');
  }
  init() {
    this.translate.get('RETRIEVING').subscribe(translation => {
      this.pop.presentLoader(translation);
    });
    this.ph.getDevices().on('value', snapshot => {
      this.devices = [];
      this.pop.hideLoader();
      snapshot.forEach(snap => {
        this.devices.push({
          sigfoxID: snap.key,
          name: snap.val().name,
          brand: snap.val().brand,
          type: snap.val().type,
          number: snap.val().number,
          pic: snap.val().picture,
          photoURL: snap.val().photoURL
        });
        return false;
      });
    });
  }
  ngOnInit() {
    if ( this.network.connected) {
      this.init();
    } else {
      this.translate.get('NO_NETWORK').subscribe(translation => {
        this.pop.presentToast(translation);
      });
      this.network.onConnect().subscribe(() => {
        this.init();
      });
    }
  }
  goToAddDevicePage() {
    if ( this.network.connected) {
      this.navCtrl.push('AddDevicePage');
    } else {
      this.translate.get('NO_NETWORK').subscribe(translation => {
        this.pop.presentToast(translation);
      });
    }
  }
  goToEditDevicePage(sigfoxID: any) {
    if ( this.network.connected) {
      this.navCtrl.push('EditDevicePage', {
        sigfoxID: sigfoxID
      });
    } else {
      this.translate.get('NO_NETWORK').subscribe(translation => {
        this.pop.presentToast(translation);
      });
    }
  }
}

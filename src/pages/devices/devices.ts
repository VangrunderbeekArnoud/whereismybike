import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {ProfileProvider} from "../../providers/profile/profile";
import {PopUpProvider} from "../../providers/pop-up/pop-up";
import {TranslateService} from "ng2-translate";
import {AnalyticsProvider} from "../../providers/analytics/analytics";

@IonicPage()
@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html',
})
export class DevicesPage {
  public devices: Array<any>;

  constructor(public navCtrl: NavController, public ph: ProfileProvider,
              public pop: PopUpProvider, private translate: TranslateService,
              private analytics: AnalyticsProvider) {
  }
  ionViewDidEnter() {
    this.analytics.page('DevicesPage');
  }
  ngOnInit() {
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
  goToAddDevicePage() {
    this.navCtrl.push('AddDevicePage');
  }
  goToEditDevicePage(sigfoxID: any) {
    this.navCtrl.push('EditDevicePage', {
      sigfoxID: sigfoxID
    });
  }
}

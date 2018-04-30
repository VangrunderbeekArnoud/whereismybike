import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfileProvider} from "../../providers/profile/profile";
import {PopUpProvider} from "../../providers/pop-up/pop-up";
import {TranslateService} from "ng2-translate";
import {LanguageProvider} from "../../providers/language/language";

@IonicPage()
@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html',
})
export class DevicesPage {
  public devices: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ph: ProfileProvider,
              public pop: PopUpProvider, private translate: TranslateService, private language: LanguageProvider) {
  }

  ionViewDidEnter() {
    this.pop.presentLoader(this.language.Retrieving);
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicesPage');
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

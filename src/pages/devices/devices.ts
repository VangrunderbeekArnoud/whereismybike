import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfileProvider} from "../../providers/profile/profile";
import {PopUpProvider} from "../../providers/pop-up/pop-up";

@IonicPage()
@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html',
})
export class DevicesPage {
  public devices: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ph: ProfileProvider,
              public pop: PopUpProvider) {
  }

  ionViewDidEnter() {
    this.pop.presentLoader('Retrieving all items...');
    this.ph.getDevices().on('value', snapshot => {
      this.devices = [];
      this.pop.hideLoader();
      snapshot.forEach(snap => {
        this.devices.push({
          sigfoxID: snap.val().sigfoxID,
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

}

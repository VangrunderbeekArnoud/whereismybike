import {Component} from '@angular/core';
import {NavController, AlertController, ModalController, ActionSheetController} from 'ionic-angular';
import {ProfileProvider} from '../../providers/profile/profile';
import {AuthProvider} from '../../providers/auth/auth';
import {IonicPage} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {PopUpProvider} from '../../providers/pop-up/pop-up';
import firebase from 'firebase/app';
import { SigfoxProvider } from "../../providers/sigfox/sigfox";

@IonicPage()
@Component({
  selector: 'page-edit-device',
  templateUrl: 'edit-device.html',
})
export class EditDevicePage {
  public userProfile: any;
  public devicesProfile: any;
  public captureDataUrl: any;
  public sigfoxID: any;
  public name: any;
  public brand: any;
  public type: any;
  public number: any;
  public pic: any;


  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, private pop: PopUpProvider, private camera: Camera, public alertCtrl: AlertController,
              public ph: ProfileProvider, public authProvider: AuthProvider, public sigfox: SigfoxProvider) {
    ph.isHome = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDevicePage');
  }


}

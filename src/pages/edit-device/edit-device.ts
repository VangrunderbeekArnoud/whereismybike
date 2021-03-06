import {Component} from '@angular/core';
import {NavController, AlertController, ActionSheetController, NavParams} from 'ionic-angular';
import {ProfileProvider} from '../../providers/profile/profile';
import {IonicPage} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {PopUpProvider} from '../../providers/pop-up/pop-up';
import firebase from 'firebase/app';
import {SigfoxProvider} from "../../providers/sigfox/sigfox";
import {TranslateService} from "ng2-translate";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {NetworkProvider} from "../../providers/network/network";

@IonicPage()
@Component({
  selector: 'page-edit-device',
  templateUrl: 'edit-device.html',
})
export class EditDevicePage {
  public userProfile: any;
  public devicesProfile: any;
  public captureDataUrl: any;
  public device: any;
  public sigfoxID: any;
  public name: any;
  public brand: any;
  public type: any;
  public number: any;
  public pic: any;
  public photoURL: any;
  public battery: any;


  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController,
              private pop: PopUpProvider, private camera: Camera,
              public alertCtrl: AlertController, public ph: ProfileProvider,
              public sigfox: SigfoxProvider, private analytics: AnalyticsProvider,
              public navParams: NavParams, private translate: TranslateService, private network: NetworkProvider) {
    ph.isHome = false;
    this.sigfoxID = navParams.get('sigfoxID');
  }

  ionViewDidEnter() {
    this.analytics.page('EditDevicePage');
  }

  ngOnInit() {
    this.device = this.ph.getDevice(this.sigfoxID);
    this.device.on('value', userProfileSnapshot => {
      this.sigfoxID = userProfileSnapshot.key;
      this.name = userProfileSnapshot.val().name;
      this.battery = userProfileSnapshot.val().battery;
      this.brand = userProfileSnapshot.val().brand;
      this.type = userProfileSnapshot.val().type;
      this.number = userProfileSnapshot.val().number;
      this.pic = userProfileSnapshot.val().picture;
      this.photoURL = userProfileSnapshot.val().photoURL;
    });
  }

  deleteDevice() {
    this.analytics.event('dev_delete', {foo: 'bar'});
    this.translate.get(['DELETE_DEV', 'CANCEL', 'YES', 'NO_NETWORK']).subscribe(translations => {
      if ( this.network.connected) {
        const alert = this.alertCtrl.create({
          message: translations.DELETE_DEV,
          buttons: [
            {
              text: translations.CANCEL,
            },
            {
              text: translations.YES,
              handler: data => {
                //this.device.off();
                this.ph.deleteDevice(this.device);
                this.navCtrl.pop();
              }
            }
          ]
        });
        alert.present();
      } else {
        this.pop.presentToast(translations.NO_NETWORK);
      }
    });
  }

  updateName() {
    this.translate.get(['NAME', 'CANCEL', 'SAVE', 'NO_NETWORK']).subscribe(translations => {
      if ( this.network.connected) {
        const alert = this.alertCtrl.create({
          message: translations.NAME,
          inputs: [
            {
              value: this.name
            },
          ],
          buttons: [
            {
              text: translations.CANCEL,
            },
            {
              text: translations.SAVE,
              handler: data => {
                console.log(data[0])
                this.ph.updateDeviceName(this.device, data[0]);
              }
            }
          ]
        });
        alert.present();
      } else {
        this.pop.presentToast(translations.NO_NETWORK);
      }
    });
  }

  updateBrand() {
    this.analytics.event('dev_update_brand', {foo: 'bar'});
    this.translate.get(['BRAND', 'CANCEL', 'SAVE', 'NO_NETWORK']).subscribe(translations => {
      if (this.network.connected) {
        const alert = this.alertCtrl.create({
          message: translations.BRAND,
          inputs: [
            {value: this.brand},
          ],
          buttons: [
            {text: translations.CANCEL},
            {
              text: translations.SAVE,
              handler: data => {
                console.log(data[0]);
                this.ph.updateDeviceBrand(this.device, data[0]);
              }
            }
          ]
        });
        alert.present();
      } else {
        this.pop.presentToast(translations.NO_NETWORK);
      }
    });
  }

  updateType() {
    this.analytics.event('dev_update_type', {foo: 'bar'});
    this.translate.get(['TYPE', 'CANCEL', 'SAVE', 'NO_NETWORK']).subscribe(translations => {
      if ( this.network.connected) {
        const alert = this.alertCtrl.create({
          message: translations.TYPE,
          inputs: [
            {value: this.type},
          ],
          buttons: [
            {text: translations.CANCEL},
            {
              text: translations.SAVE,
              handler: data => {
                console.log(data[0]);
                this.ph.updateDeviceType(this.device, data[0]);
              }
            }
          ]
        });
        alert.present();
      } else {
        this.pop.presentToast(translations.NO_NETWORK);
      }
    });
  }

  updateNumber() {
    this.analytics.event('dev_update_number', {foo: 'bar'});
    this.translate.get(['ENGNR', 'CANCEL', 'SAVE', 'NO_NETWORK']).subscribe(translations => {
      if ( this.network.connected) {
        const alert = this.alertCtrl.create({
          message: translations.ENGNR,
          inputs: [
            {
              value: this.number
            },
          ],
          buttons: [
            {
              text: translations.CANCEL,
            },
            {
              text: translations.SAVE,
              handler: data => {
                this.ph.updateDeviceNumber(this.device, data[0]);
              }
            }
          ]
        });
        alert.present();
      } else {
        this.pop.presentToast(translations.NO_NETWORK);
      }
    });
  }

  choosePic() {
    this.translate.get(['CHOOSE_FROM', 'CAMERA', 'FILE', 'CANCEL', 'NO_NETWORK']).subscribe(translations => {
      if ( this.network.connected) {
        let actionSheet = this.actionSheetCtrl.create({
          title: translations.CHOOSE_FROM,
          buttons: [
            {
              text: translations.CAMERA,
              icon: 'ios-camera',
              handler: () => {
                this.changePic()
              }
            }, {
              text: translations.FILE,
              icon: 'ios-folder',
              handler: () => {
                this.changePicFromFile()
              }
            }, {
              text: translations.CANCEL,
              icon: 'close',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        actionSheet.present();
      } else {
        this.pop.presentToast(translations.NO_NETWORK);
      }
    });
  }

  changePic() {
    const cameraOptions: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.processProfilePicture(this.captureDataUrl)
    })
  }

  changePicFromFile() {
    const cameraOptions: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 20,
      encodingType: this.camera.EncodingType.PNG,
    };
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.processProfilePicture(this.captureDataUrl)
    })
  }

  processProfilePicture(captureData) {
    this.translate.get('PROCESSING_IMG').subscribe(translation => {
      this.pop.presentLoader(translation);
    });
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`userPictures/${filename}.jpg`);
    imageRef.putString(captureData, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      imageRef.getDownloadURL().then(url => {
        //console.log(url)
        this.ph.UpdateDevicePhoto(this.device, url).then(success => {
          //  console.log(url)
          this.pop.hideLoader();
          //console.log("done")
          //this.profileUploaded = true

        }).catch(error => {
          alert(error)
        });
      }).catch(error => {
        alert(error)
      });
    }).catch(error => {
      alert(error)
    });
    this.analytics.event('dev_update_photo', {foo: 'bar'});
  }
}

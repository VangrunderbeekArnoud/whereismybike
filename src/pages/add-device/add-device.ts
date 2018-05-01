import {Component} from '@angular/core';
import {NavController, AlertController, ModalController, ActionSheetController} from 'ionic-angular';
import {ProfileProvider} from '../../providers/profile/profile';
import {AuthProvider} from '../../providers/auth/auth';
import {IonicPage} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {PopUpProvider} from '../../providers/pop-up/pop-up';
import firebase from 'firebase/app';
import { SigfoxProvider } from "../../providers/sigfox/sigfox";
import {TranslateService} from "ng2-translate";
import {LanguageProvider} from "../../providers/language/language";

@IonicPage()
@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html',
})
export class AddDevicePage {
  public initState: boolean =  true;
  public userProfile: any;
  public devicesProfile: any;
  public captureDataUrl: any;
  public sigfoxID: any;
  public name: any;
  public brand: any;
  public type: any;
  public number: any;
  public pic: any;
  public device: any;
  private reference: any;

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController, private pop: PopUpProvider, private camera: Camera,
              public alertCtrl: AlertController, public ph: ProfileProvider,
              public authProvider: AuthProvider, public sigfox: SigfoxProvider,
              private translate: TranslateService) {
    ph.isHome = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDevicePage');
  }

  ionViewDidEnter() {
    console.log('AddDevicesPage: ionViewDidEnter() called');
  }

  listeners() {
    this.reference = this.device.on('value', snapshot => {
      this.sigfoxID = snapshot.key;
      this.name = snapshot.val().name;
      this.brand = snapshot.val().brand;
      this.type = snapshot.val().type;
      this.number = snapshot.val().number;
      this.pic = snapshot.val().picture;
    });
  }

  proceed() {
    this.navCtrl.pop();
  }

  cancel() {
    if ( this.device) { // Delete device in the database
      //this.device.off();
      this.ph.deleteDevice(this.device);
    }
    this.navCtrl.pop();
  }

  addDevice() {
    this.translate.get(['DEV_ID', 'CANCEL', 'SAVE', 'DEV_VALID_ID', 'DEV_EXISTS']).subscribe(translations => {
      const alert = this.alertCtrl.create({
        message: translations.DEV_ID,
        inputs: [
          { },
        ],
        buttons: [
          { text: translations.CANCEL},
          { text: translations.SAVE,
            handler: data => {
              this.ph.addDevice(data[0]).then((res) => {
                if ( res == 1) {
                  this.pop.presentToast( translations.DEV_VALID_ID);
                } else if ( res == 2) {
                  this.pop.presentToast( translations.DEV_EXISTS);
                } else {
                  this.initState = false;
                  this.device = this.ph.getDevice(data[0]);
                  this.listeners();
                }
              });
            }}
        ]
      });
      alert.present();
    });
  }
  updateName() {
    this.translate.get(['NAME', 'CANCEL', 'SAVE']).subscribe(translations => {
      const alert = this.alertCtrl.create({
        message: translations.NAME,
        inputs: [
          {
            value: this.device.name
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
    });
  }
  updateBrand() {
    this.translate.get(['BRAND', 'CANCEL', 'SAVE']).subscribe(translations => {
      const alert = this.alertCtrl.create({
        message: translations.BRAND,
        inputs: [
          { value: this.device.brand },
        ],
        buttons: [
          { text: translations.CANCEL},
          { text: translations.SAVE,
            handler: data => {
              console.log(data[0]);
              this.ph.updateDeviceBrand(this.device, data[0]);
            }}
        ]
      });
      alert.present();
    });
  }
  updateType() {
    this.translate.get(['TYPE', 'CANCEL', 'SAVE']).subscribe(translations => {
      const alert = this.alertCtrl.create({
        message: translations.TYPE,
        inputs: [
          { value: this.device.type },
        ],
        buttons: [
          { text: translations.CANCEL},
          { text: translations.SAVE,
            handler: data => {
              console.log(data[0]);
              this.ph.updateDeviceType(this.device, data[0]);
            }}
        ]
      });
      alert.present();
    });
  }

  updateNumber() {
    this.translate.get(['ENGNR', 'CANCEL', 'SAVE']).subscribe(translations => {
      const alert = this.alertCtrl.create({
        message: translations.ENGNR,
        inputs: [
          {
            value: this.device.number
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
              this.ph.updateDeviceNumber(this.device, data[0]);
            }
          }
        ]
      });
      alert.present();
    });
  }

  remove(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot('LoginPage');
    });
  }

  choosePic() {
    this.translate.get(['CHOOSE_FROM', 'CAMERA', 'FILE', 'CANCEL']).subscribe(translations => {
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
        this.ph.UpdateDevicePhoto( this.device, url).then(success => {
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
  }
}

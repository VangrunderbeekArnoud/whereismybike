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

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, private pop: PopUpProvider, private camera: Camera, public alertCtrl: AlertController,
              public ph: ProfileProvider, public authProvider: AuthProvider, public sigfox: SigfoxProvider) {
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
      this.sigfoxID = snapshot.val().sigfoxID;
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
      this.device.off();
      this.ph.deleteDevice(this.device);
    }
    this.navCtrl.pop();
  }

  addDevice() {
    const alert = this.alertCtrl.create({
      message: "Device ID",
      inputs: [
        { },
      ],
      buttons: [
        { text: 'Cancel'},
        { text: 'Save',
        handler: data => {
          this.ph.addDevice(data[0]).then((res) => {
            if ( res == 1) {
              this.pop.presentToast( 'Please enter a valid device ID.');
            } else if ( res == 2) {
              this.pop.presentToast( 'Device already exists!');
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
  }
  updateName() {
    const alert = this.alertCtrl.create({
      message: "Your Name",
      inputs: [
        {
          value: this.device.name
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data[0])
            this.ph.updateDeviceName(this.device, data[0]);
          }
        }
      ]
    });
    alert.present();
  }
  updateBrand() {
    const alert = this.alertCtrl.create({
      message: "Brand name of your bike",
      inputs: [
        { value: this.device.brand },
      ],
      buttons: [
        { text: 'Cancel'},
        { text: 'Save',
          handler: data => {
            console.log(data[0]);
            this.ph.updateDeviceBrand(this.device, data[0]);
          }}
      ]
    });
    alert.present();
  }
  updateType() {
    const alert = this.alertCtrl.create({
      message: "Type of the bike",
      inputs: [
        { value: this.device.type },
      ],
      buttons: [
        { text: 'Cancel'},
        { text: 'Save',
          handler: data => {
            console.log(data[0]);
            this.ph.updateDeviceType(this.device, data[0]);
          }}
      ]
    });
    alert.present();
  }

  updateNumber() {
    const alert = this.alertCtrl.create({
      message: "Bike engravings number",
      inputs: [
        {
          value: this.device.number
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data[0])
            this.ph.updateDeviceNumber(this.device, data[0]);
          }
        }
      ]
    });
    alert.present();
  }

  remove(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot('LoginPage');
    });
  }

  choosePic() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose From',
      buttons: [
        {
          text: 'Camera',
          icon: 'ios-camera',
          handler: () => {
            this.changePic()
          }
        }, {
          text: 'File',
          icon: 'ios-folder',
          handler: () => {
            this.changePicFromFile()
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
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
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    this.pop.presentLoader('Processing image..')
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

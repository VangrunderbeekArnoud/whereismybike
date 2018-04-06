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
    sigfox.test = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDevicePage');
  }

  ionViewDidEnter() {
    console.log('AddDevicesPage: ionViewDidEnter() called');
    this.sigfox.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
    });
    this.sigfox.getDevicesProfile().on('value', devicesProfileSnapshot => {
      this.devicesProfile = devicesProfileSnapshot.val();
      this.sigfoxID = devicesProfileSnapshot.val().sigfoxID;
      this.name = devicesProfileSnapshot.val().name;
      this.brand = devicesProfileSnapshot.val().brand;
      this.type = devicesProfileSnapshot.val().type;
      this.number = devicesProfileSnapshot.val().number;
      this.pic = devicesProfileSnapshot.val().picture;
    })
  }

  cancel() {
    console.log('navCtrl.pop(): AddDevicePage -> DevicesPage');
    this.navCtrl.pop();
  }

  updatesigfoxID() {
    const alert = this.alertCtrl.create({
      message: "Device ID",
      inputs: [
        { value: this.devicesProfile.sigfoxID },
      ],
      buttons: [
        { text: 'Cancel'},
        { text: 'Save',
        handler: data => {
          console.log(data[0]);
          this.sigfox.updateSigfoxID(data[0]);
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

          value: this.devicesProfile.name
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
            this.sigfox.updateName(data[0]);
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
        { value: this.devicesProfile.brand },
      ],
      buttons: [
        { text: 'Cancel'},
        { text: 'Save',
          handler: data => {
            console.log(data[0]);
            this.sigfox.updateBrand(data[0]);
          }}
      ]
    });
    alert.present();
  }
  updateType() {
    const alert = this.alertCtrl.create({
      message: "Type of the bike",
      inputs: [
        { value: this.devicesProfile.type },
      ],
      buttons: [
        { text: 'Cancel'},
        { text: 'Save',
          handler: data => {
            console.log(data[0]);
            this.sigfox.updateType(data[0]);
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
          value: this.devicesProfile.number
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
            this.sigfox.updateNumber(data[0]);
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
        this.ph.UpdatePhoto(url).then(success => {
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

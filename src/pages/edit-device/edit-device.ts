import {Component} from '@angular/core';
import {NavController, AlertController, ModalController, ActionSheetController, NavParams} from 'ionic-angular';
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
              public modalCtrl: ModalController, private pop: PopUpProvider, private camera: Camera,
              public alertCtrl: AlertController, public ph: ProfileProvider,
              public authProvider: AuthProvider, public sigfox: SigfoxProvider,
              public navParams: NavParams) {
    ph.isHome = false;
    this.sigfoxID = navParams.get('sigfoxID');
  }

  ionViewDidEnter() {
    this.device = this.ph.getDevice(this.sigfoxID);
    this.device.on('value', userProfileSnapshot => {
      this.sigfoxID = userProfileSnapshot.val().sigfoxID;
      this.name = userProfileSnapshot.val().name;
      this.battery = userProfileSnapshot.val().battery;
      this.brand = userProfileSnapshot.val().brand;
      this.type = userProfileSnapshot.val().type;
      this.number = userProfileSnapshot.val().number;
      this.pic = userProfileSnapshot.val().picture;
      this.photoURL = userProfileSnapshot.val().photoURL;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDevicePage');
  }

  deleteDevice() {
    const alert = this.alertCtrl.create({
      message: "Delete device?",
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler: data => {
            this.device.off();
            this.ph.deleteDevice(this.device);
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  updateName() {
    const alert = this.alertCtrl.create({
      message: "Your Name",
      inputs: [
        {
          value: this.name
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
        { value: this.brand },
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
        { value: this.type },
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
          value: this.number
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.ph.updateDeviceNumber(this.device, data[0]);
          }
        }
      ]
    });
    alert.present();
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

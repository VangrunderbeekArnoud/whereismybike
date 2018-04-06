import {Component} from '@angular/core';
import {NavController, AlertController, ModalController, ActionSheetController} from 'ionic-angular';
import {ProfileProvider} from '../../providers/profile/profile';
import {AuthProvider} from '../../providers/auth/auth';
import {IonicPage} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {PopUpProvider} from '../../providers/pop-up/pop-up';
import firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html',
})
export class AddDevicePage {
  public userProfile: any;
  public captureDataUrl: any;
  public deviceID: any;
  public name: any;
  public brand: any;
  public type: any;
  public number: any;
  public pic: any;


  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, private pop: PopUpProvider, private camera: Camera, public alertCtrl: AlertController,
              public ph: ProfileProvider, public authProvider: AuthProvider) {
    ph.isHome = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDevicePage');
  }

  ionViewDidEnter() {
    console.log('AddDevicesPage: ionViewDidEnter() called');
    this.ph.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.deviceID = userProfileSnapshot.val().deviceID;
      this.name = userProfileSnapshot.val().name;
      this.brand = userProfileSnapshot.val().brand;
      this.type = userProfileSnapshot.val().type;
      this.number = userProfileSnapshot.val().number;
      this.pic = userProfileSnapshot.val().picture;
    });
  }

  cancel() {
    console.log('navCtrl.pop(): AddDevicePage -> DevicesPage');
    this.navCtrl.pop();
  }

  updateDeviceID() {
    const alert = this.alertCtrl.create({
      message: "Device ID",
      inputs: [
        { value: this.userProfile.name },
      ],
      buttons: [
        { text: 'Cancel'},
        { text: 'Save',
        handler: data => {
          console.log(data[0]);
          this.ph.updateName(data[0]);
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

          value: this.userProfile.name
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
            this.ph.updateName(data[0]);
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
        { value: this.userProfile.name },
      ],
      buttons: [
        { text: 'Cancel'},
        { text: 'Save',
          handler: data => {
            console.log(data[0]);
            this.ph.updateName(data[0]);
          }}
      ]
    });
    alert.present();
  }
  updateType() {
    const alert = this.alertCtrl.create({
      message: "Type of the bike",
      inputs: [
        { value: this.userProfile.name },
      ],
      buttons: [
        { text: 'Cancel'},
        { text: 'Save',
          handler: data => {
            console.log(data[0]);
            this.ph.updateName(data[0]);
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
          value: this.userProfile.phoneNumber
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
            this.ph.UpdateNumber(data[0]);
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

import {Component} from '@angular/core';
import {NavController, AlertController, ModalController, ActionSheetController} from 'ionic-angular';
import {ProfileProvider} from '../../providers/profile/profile';
import {AuthProvider} from '../../providers/auth/auth';
import {IonicPage} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {PopUpProvider} from '../../providers/pop-up/pop-up';
import firebase from 'firebase/app';
import { TranslateService} from "ng2-translate";
import {LanguageProvider} from "../../providers/language/language";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(private translate: TranslateService, public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, private pop: PopUpProvider, private camera: Camera, public alertCtrl: AlertController,
              public ph: ProfileProvider, public authProvider: AuthProvider, private language: LanguageProvider) {
    ph.isHome = false;
  }

  remove(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot('LoginPage');
    });
  }
  choosePic() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.language.ChooseFrom,
      buttons: [
        {
          text: this.language.Camera,
          icon: 'ios-camera',
          handler: () => {
            this.changePic()
          }
        }, {
          text: this.language.File,
          icon: 'ios-folder',
          handler: () => {
            this.changePicFromFile()
          }
        }, {
          text: this.language.Cancel,
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
      let captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.processProfilePicture(captureDataUrl);
    });
  }
  changePicFromFile() {
    const cameraOptions: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 20,
      encodingType: this.camera.EncodingType.PNG,
    };
    this.camera.getPicture(cameraOptions).then((imageData) => {
      let captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.processProfilePicture(captureDataUrl);
    });
  }

  processProfilePicture(captureData) {
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    this.pop.presentLoader(this.language.ProcessingImg);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`userPictures/${filename}.jpg`);
    imageRef.putString(captureData, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      imageRef.getDownloadURL().then(url => {
        //console.log(url)
        this.ph.updatePhoto(url).then(success => {
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
  updateNumber() {
    const alert = this.alertCtrl.create({
      message: this.language.Phone,
      inputs: [
        { value: this.ph.user.phone},
      ],
      buttons: [
        { text: this.language.Cancel},
        {
          text: this.language.Save,
          handler: data => {
            console.log(data[0]);
            this.ph.updatePhone(data[0]);
          }
        }
      ]
    });
    alert.present();
  }


  updateName() {
    const alert = this.alertCtrl.create({
      message: this.language.Name,
      inputs: [
        { value: this.ph.user.name},
      ],
      buttons: [
        { text: this.language.Cancel},
        {
          text: this.language.Save,
          handler: data => {
            console.log(data[0]);
            this.ph.updateName(data[0]);
          }
        }
      ]
    });
    alert.present();
  }

  logOut() {
    const alert = this.alertCtrl.create({
      message: this.language.Logout,
      buttons: [
        { text: this.language.Cancel},
        {
          text: this.language.Yes,
          handler: data => {
            this.remove();
          }
        }
      ]
    });
    alert.present();
  }

}

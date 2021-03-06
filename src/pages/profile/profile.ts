import {Component} from '@angular/core';
import {NavController, AlertController, ActionSheetController} from 'ionic-angular';
import {ProfileProvider} from '../../providers/profile/profile';
import {AuthProvider} from '../../providers/auth/auth';
import {IonicPage} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {PopUpProvider} from '../../providers/pop-up/pop-up';
import firebase from 'firebase/app';
import { TranslateService} from "ng2-translate";
import {StatusBar} from "@ionic-native/status-bar";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {NetworkProvider} from "../../providers/network/network";
import {InAppBrowser, InAppBrowserOptions} from "@ionic-native/in-app-browser";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(private translate: TranslateService, public navCtrl: NavController,
              public actionSheetCtrl: ActionSheetController, private analytics: AnalyticsProvider,
              private pop: PopUpProvider, private camera: Camera, private network: NetworkProvider,
              public alertCtrl: AlertController, private statusBar: StatusBar,
              public ph: ProfileProvider, public authProvider: AuthProvider,
              private iab: InAppBrowser) {
    ph.isHome = false;
  }
  ionViewDidEnter() {
    this.analytics.page('ProfilePage');
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
    this.analytics.event('user_update_photo',{foo:'bar'});
  }
  updateNumber() {
    this.translate.get(['PHONE', 'CANCEL', 'SAVE', 'NO_NETWORK']).subscribe(translations => {
      if ( this.network.connected) {
        const alert = this.alertCtrl.create({
          message: translations.PHONE,
          inputs: [
            { value: this.ph.user.phone},
          ],
          buttons: [
            { text: translations.CANCEL},
            {
              text: translations.SAVE,
              handler: data => {
                console.log(data[0]);
                this.ph.updatePhone(data[0]);
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
            { value: this.ph.user.name},
          ],
          buttons: [
            { text: translations.CANCEL},
            {
              text: translations.SAVE,
              handler: data => {
                console.log(data[0]);
                this.ph.updateName(data[0]);
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
  logOut() {
    this.translate.get(['LOGOUT', 'CANCEL', 'YES']).subscribe(translations => {
      const alert = this.alertCtrl.create({
        message: translations.LOGOUT,
        buttons: [
          { text: translations.CANCEL},
          {
            text: translations.YES,
            handler: data => {
              this.remove();
            }
          }
        ]
      });
      alert.present();
    });
    this.analytics.event('logout',{foo:'bar'});
  }
  remove(): void {
    this.authProvider.logoutUser().then(() => {
      this.statusBar.hide();
      this.navCtrl.setRoot('LoginPage');
    });
  }
  goToPrivacy() {
    this.navCtrl.push('PrivacyPage');
  }
  goToLegal() {
    this.analytics.event('Legal', {foo:'bar'});
    const options: InAppBrowserOptions = {
      location: "no",
    }
    const browser = this.iab.create('https://google.com', '_self', options );
  }

}

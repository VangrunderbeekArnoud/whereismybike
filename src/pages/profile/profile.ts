import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
import { IonicPage } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PopUpProvider } from '../../providers/pop-up/pop-up';
import firebase from 'firebase/app';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile:any;
  public birthDate:string;
  public phoneNumber: any;
  public work: any;
  public home: any;
  public name: any;
  public pic: any;
  public captureDataUrl: any;
  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, private pop: PopUpProvider, private camera: Camera, public alertCtrl: AlertController, 
    public ph: ProfileProvider, public authProvider: AuthProvider) {
      ph.isHome = false;
    }

  ionViewDidEnter() {
    this.ph.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.phoneNumber = userProfileSnapshot.val().phoneNumber;
      this.pic = userProfileSnapshot.val().picture;
      this.home = userProfileSnapshot.val().Home;
      this.name = userProfileSnapshot.val().name;
      this.work = userProfileSnapshot.val().Work;
    });
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
      },{
        text: 'File',
        icon: 'ios-folder',
        handler: () => {
         this.changePicFromFile()
        }
      },{
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
   
    imageRef.putString(captureData, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
      imageRef.getDownloadURL().then(url => {
        //console.log(url)
       this.ph.UpdatePhoto(url).then( success =>{
      //  console.log(url)
        this.pop.hideLoader();
          //console.log("done")
          //this.profileUploaded = true
      
    }).catch( error =>{ alert(error)});
      }).catch( error =>{ alert(error)});
    }).catch( error =>{ alert(error)});
  }


  updateNumber(){
    const alert = this.alertCtrl.create({
      message: "Your New Number",
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
            console.log(data)
            this.ph.UpdateNumber(data);
          }
        }
      ]
    });
    alert.present();
  }


  updateName(){
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
            console.log(data)
            this.ph.updateName(data);
          }
        }
      ]
    });
    alert.present();
  }




  updateHome(){
    let modal = this.modalCtrl.create('AutocompletePage');
    modal.onDidDismiss(data => {
    if (data != null){
      this.ph.UpdateHome(data);
    }
  })

    modal.present()
    
  }


  updateWork(){
    let modal = this.modalCtrl.create('AutocompletePage');
    modal.onDidDismiss(data => {
    if (data != null){
      this.ph.UpdateWork(data);
    }
  })
  modal.present()
  }




  logOut(){
    const alert = this.alertCtrl.create({
      message: "Are You Sure To Logout ?",
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler: data => {
           this.remove()
          }
        }
      ]
    });
    alert.present();
  }

}

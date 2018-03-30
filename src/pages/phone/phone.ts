import { Component } from '@angular/core';
import { IonicPage, NavParams, AlertController, NavController } from 'ionic-angular';
import firebase from 'firebase/app';
import {Firebase} from '@ionic-native/firebase';
import { PopUpProvider } from '../../providers/pop-up/pop-up';
import { ProfileProvider } from '../../providers/profile/profile';
@IonicPage()
@Component({
  selector: 'page-phone',
  templateUrl: 'phone.html',
})
export class PhonePage {
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  verificationId: any = '';
  phoneNumber: any = '';
  countryCode: any = '';
  result: any;
  constructor(public navCtrl: NavController, public ph: ProfileProvider, private api: PopUpProvider, public navParams: NavParams, private alertCtrl: AlertController,public firebase: Firebase) {
  }

  ionViewDidLoad() {
   setTimeout(() =>{
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': (response) => {
        console.log("success", response);
    },
    'expired-callback': () => {
        console.log("expired-callback");
    }
  });
    console.log('ionViewDidLoad PhoneVerificationPage');
   // alert('show recaptcha')

    this.recaptchaVerifier.render().then((widgetId) => {
    // this.recaptchaWidgetId = widgetId;
  });
}, 2000)
  }



  signIn(phoneNumber: number) { //Step 2 - Pass the mobile number for verification
    this.api.presentLoader('You Will Recieve An SMS Shortly');
    let number = this.phoneNumber;
    this.countryCode = '+' + 32 ;
    let au = this.countryCode + number
    console.log(au);
    (<any>window).FirebasePlugin.verifyPhoneNumber(au, 60, (credential) =>{
      this.api.hideLoader();
      var verificationId = credential.verificationId;
      this.navCtrl.push('OtpPage',{verificationid: au}); //This is STEP 3 - passing verification ID to OTP Page
  }, (error) =>{
      //this.eer = error;
      document.getElementById("mybutton").innerText = 'RESEND'
      this.api.hideLoader();
      this.api.presentToast('Failed to send SMS. Try again');
     // alert(error);
      this.api.showAlert(error, 'Try Again')
    });

  }
}

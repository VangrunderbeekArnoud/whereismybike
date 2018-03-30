import { PopUpProvider } from '../../providers/pop-up/pop-up';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';
import { ProfileProvider } from '../../providers/profile/profile';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  verification_id: any;
  otp:string='';
  constructor(public navCtrl: NavController, public ph: ProfileProvider, private pop: PopUpProvider, public navParams: NavParams) {
  this.verification_id = this.navParams.get('verificationid');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }

  roleSelection() {
    this.pop.presentLoader('Verifying...');
    // var signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verification_id,this.otp);
    // firebase.auth().signInWithCredential(signInCredential).then(()=>{    
    //   console.log(signInCredential);
      // setTimeout(()=>{
        this.ph.UpdateNumber(this.verification_id).then(()=>{
          this.pop.hideLoader();
          // this.pop.presentToast('OTP Verified');
           this.navCtrl.setRoot('HomePage');
        })
      // }, 2000);
     
    // }).catch(()=>{
    //   this.pop.hideLoader();
    //   this.pop.showAlert('OTP Failed','Failed to verify OTP');
    //   console.log('Erorr in OTP');
    // });
    
  }
}
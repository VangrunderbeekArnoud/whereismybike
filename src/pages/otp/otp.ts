import { PopUpProvider } from '../../providers/pop-up/pop-up';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';
import { ProfileProvider } from '../../providers/profile/profile';
import {TranslateService} from "ng2-translate";

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  verification_id: any;
  otp:string='';
  constructor(public navCtrl: NavController, public ph: ProfileProvider,
              private pop: PopUpProvider, public navParams: NavParams,
              private translate: TranslateService) {
  this.verification_id = this.navParams.get('verificationid');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }

  roleSelection() {
    this.translate.get('VERIFY').subscribe(translation => {
      this.pop.presentLoader(translation);
    });
    // var signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verification_id,this.otp);
    // firebase.auth().signInWithCredential(signInCredential).then(()=>{
    //   console.log(signInCredential);
      // setTimeout(()=>{
        this.ph.updatePhone(this.verification_id).then(()=>{
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

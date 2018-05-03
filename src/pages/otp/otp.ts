import { PopUpProvider } from '../../providers/pop-up/pop-up';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import {TranslateService} from "ng2-translate";
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  verification_id: any;
  otp:string='';
  private phone;
  constructor(public navCtrl: NavController, public ph: ProfileProvider,
              private pop: PopUpProvider, public navParams: NavParams,
              private translate: TranslateService) {
  this.verification_id = this.navParams.get('verificationid');
  this.phone = this.navParams.get('phone');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }

  roleSelection() {
    this.translate.get('VERIFY').subscribe(translation => {
      this.pop.presentLoader(translation);
    });
     //var signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verification_id,this.otp);
     //firebase.auth().signInWithCredential(signInCredential).then(()=>{
       setTimeout(()=>{
        this.ph.updatePhone(this.phone).then(()=>{
          this.pop.hideLoader();
          // this.pop.presentToast('OTP Verified');
           this.navCtrl.setRoot('HomePage');
        })
       }, 5000);

     //}).catch(()=>{
     //  this.pop.hideLoader();
     //  this.pop.showAlert('OTP Failed','Failed to verify OTP');
     //  console.log('Erorr in OTP');
     //});

  }
}

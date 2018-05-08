import { Component } from '@angular/core';
import {
  NavController,
  Loading,
  LoadingController,
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { IonicPage } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import {TranslateService} from "ng2-translate";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm: FormGroup;
  loading: Loading;
  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
              public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
              public ph: ProfileProvider, public alertCtrl: AlertController,
              private translate: TranslateService, private analytics: AnalyticsProvider) {

      this.signupForm = formBuilder.group({
        name: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
    }
  ionViewDidEnter() {
    this.analytics.page('SignupPage');
  }
  signupUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then(() => {
        this.loading.dismiss().then( () => {
          this.ph.updateName(this.signupForm.value.name);
          if (this.ph.user.phone == null)
            this.navCtrl.push('StartupPage');
            else
            this.navCtrl.setRoot('HomePage');
        });
      }, (error) => {
        this.loading.dismiss().then( () => {
          this.translate.get('OK').subscribe(translation => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: translation,
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }



  goToLogin(){
    this.navCtrl.setRoot('LoginPage');
  }

}

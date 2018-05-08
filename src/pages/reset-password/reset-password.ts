import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { IonicPage } from 'ionic-angular';
import {TranslateService} from "ng2-translate";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public resetPasswordForm: FormGroup;

  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
              public formBuilder: FormBuilder, public alertCtrl: AlertController,
              private translate: TranslateService, private analytics: AnalyticsProvider) {

      this.resetPasswordForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      });
  }
  ionViewDidEnter() {
    this.analytics.page('ResetPasswordPage');
  }
  resetPassword(){
    if (!this.resetPasswordForm.valid){
      console.log(this.resetPasswordForm.value);
    } else {
      this.authProvider.resetPassword(this.resetPasswordForm.value.email)
      .then((user) => {
        this.translate.get(['EMAIL_RESET_LINK', 'OK']).subscribe(translations => {
          let alert = this.alertCtrl.create({
            message: translations.EMAIL_RESET_LINK,
            buttons: [
              {
                text: translations.OK,
                role: 'cancel',
                handler: () => { this.navCtrl.pop(); }
              }
            ]
          });
          alert.present();
        });

      }, (error) => {
        var errorMessage: string = error.message;
        this.translate.get('OK').subscribe(translation => {
          let errorAlert = this.alertCtrl.create({
            message: errorMessage,
            buttons: [{ text: translation, role: 'cancel' }]
          });
          errorAlert.present();
        });
      });
    }
  }
}

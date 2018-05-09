import { Component } from '@angular/core';
import {
  Loading,
  Platform,
  LoadingController,
  NavController,
  AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import { IonicPage } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { NativeMapContainerProvider } from '../../providers/native-map-container/native-map-container';
import {TranslateService} from "ng2-translate";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  loading: Loading;
  public initState: boolean =  false;

  constructor(public navCtrl: NavController, public ntP: NativeMapContainerProvider,
              public platform: Platform, public menu: MenuController,
              public loadingCtrl: LoadingController, private analytics: AnalyticsProvider,
              public alertCtrl: AlertController, public authProvider: AuthProvider, public ph: ProfileProvider,
              public formBuilder: FormBuilder, private translate: TranslateService) {
      menu.swipeEnable(false, 'menu1');
      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });

  }
  ionViewDidEnter() {
    this.analytics.page('LoginPage');
  }
  loginUser(): void {
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        this.loading.dismiss().then( () => {
          this.ph.getUserPhoneReference().on('value', snapshot => {
            if ( snapshot.val() == null)
              this.navCtrl.setRoot('StartupPage');
            else
              this.navCtrl.setRoot('HomePage');
          });
        });
      }, error => {
        this.loading.dismiss().then( () => {
          this.translate.get(['OK', 'CANCEL']).subscribe(translations => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: translations.OK,
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
      this.analytics.event('login',{foo:'bar'});
    }
  }

  goToSignup(): void {
    this.navCtrl.push('EntrancePage');
  }

  goToResetPassword(): void {
    this.navCtrl.push('ResetPasswordPage');
  }



}

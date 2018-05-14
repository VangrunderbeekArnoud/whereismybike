import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, Platform} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {PopUpProvider} from "../../providers/pop-up/pop-up";
import {StatusBar} from "@ionic-native/status-bar";
import {ProfileProvider} from "../../providers/profile/profile";
import {Diagnostic} from '@ionic-native/diagnostic';
import {TranslateService} from "ng2-translate";
import {NetworkProvider} from "../../providers/network/network";

/**
 * Generated class for the PrivacyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {
  private locationState: string = '';
  private notificationState: string = '';
  constructor(private alertCtrl: AlertController, private auth: AuthProvider,
              private pop: PopUpProvider, private statusBar: StatusBar,
              private navCtrl: NavController, private ph: ProfileProvider,
              private diagnostic: Diagnostic, private platform: Platform,
              private translate: TranslateService, private network: NetworkProvider) {
    this.setLocationState();
    this.setNotificationState();
    this.platform.ready().then(() => {
      this.platform.resume.subscribe(() => {
        this.setLocationState();
        this.setNotificationState();
      });
    });
  }
  setLocationState() {
    this.platform.ready().then(() => {
      if ( this.platform.is('cordova')) {
        this.translate.get(['ON', 'OFF']).subscribe(translations => {
          this.diagnostic.isLocationAvailable().then((state: boolean) => {
            if ( state) {
              this.locationState = translations.ON;
            } else {
              this.locationState = translations.OFF;
            }
          });
        })
      } else {
        this.locationState = '???';
      }
    });
  }
  setNotificationState() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.translate.get(['ON', 'OFF']).subscribe(translations => {
          this.diagnostic.isRemoteNotificationsEnabled().then((state: boolean) => {
            if ( state) {
              this.notificationState = translations.ON;
            } else {
              this.notificationState = translations.OFF;
            }
          });
        });
      } else {
        this.notificationState = '???';
      }
    });
  }
  settings() {
    if ( this.platform.is('cordova')) {
      this.diagnostic.switchToSettings();
    }
  }
  deleteAccount() {
    this.translate.get(['DELETE_ACCOUNT', 'DELETE_ACCOUNT_INFO', 'PASSWD', 'CANCEL', 'DELETE', 'WRONG_PASSWD', 'NO_NETWORK']).subscribe(translations => {
      if ( this.network.connected) {
        const alert = this.alertCtrl.create({
          title:translations.DELETE_ACCOUNT,
          message: translations.DELETE_ACCOUNT_INFO,
          inputs: [
            { type: 'password',
              placeholder:translations.PASSWD},
          ],
          buttons: [
            { text: translations.CANCEL},
            {
              text: translations.DELETE,
              handler: data => {
                this.auth.deleteUser(data[0]).then(() => {
                  this.ph.deleteUser();
                  this.statusBar.hide();
                  this.navCtrl.setRoot('LoginPage');
                }, () => {
                  this.pop.presentToast(translations.WRONG_PASSWD);
                });
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
}

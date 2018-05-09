import { Injectable } from '@angular/core';
import {Network} from '@ionic-native/network';
import {Platform, ToastController} from "ionic-angular";
import {TranslateService} from "ng2-translate";

@Injectable()
export class NetworkProvider extends Network {
  public connected: boolean = false;
  constructor(private toastCtrl: ToastController,
              private platform: Platform, private translate: TranslateService) {
    super();
    this.init();
  }
  init() {
    this.platform.ready().then(() => {
      this.translate.get('NO_NETWORK').subscribe(translation => {
        let toast;
        if ( this.type == 'none') {
          toast = this.toastCtrl.create({
            message: translation,
            position: 'bottom',
          });
          toast.present();
          this.connected = false;
        } else {
          this.connected = true;
        }
        this.onDisconnect().subscribe(() => {
          console.log('network disconnected');
          toast = this.toastCtrl.create({
            message: translation,
            position: 'bottom',
          });
          toast.present();
          this.connected = false;
        });
        this.onConnect().subscribe(() => {
          console.log('network connected');
          toast.dismiss();
          this.connected = true;
        });
      });
    });
  }

}

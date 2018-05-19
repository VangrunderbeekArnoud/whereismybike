import { Injectable } from '@angular/core';
import { Firebase} from '@ionic-native/firebase';
import { Platform} from "ionic-angular";

@Injectable()
export class FcmProvider {

  constructor(
    private firebase: Firebase,
    private platform: Platform
  ) { }

  async getToken() {
    console.log('getToken');
    let token;
    if ( this.platform.is('android')){
      token = await this.firebase.getToken();
    }
    if ( this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }
    if ( !this.platform.is('cordova')) {
      // todo
    }
  }
  public listenToNotifications() {
    return this.firebase.onNotificationOpen();
  }

}

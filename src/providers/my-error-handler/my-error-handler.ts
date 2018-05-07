import {ErrorHandler, Injectable} from '@angular/core';
import {IonicErrorHandler, Platform} from "ionic-angular";
import {Firebase} from "@ionic-native/firebase";

@Injectable()
export class MyErrorHandler extends IonicErrorHandler implements ErrorHandler {
  constructor(private platform: Platform, private firebase: Firebase) {
    super();
  }
  handleError(error: any) {
    super.handleError(error);
    this.platform.ready().then(() => {
      if ( this.platform.is('cordova')) {
        //console.log('firebase.logError');
        this.firebase.logError(error.toString());
      }
    });
  }
}

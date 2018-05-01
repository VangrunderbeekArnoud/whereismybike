import { Injectable, Injector} from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { NativeMapContainerProvider } from '../../providers/native-map-container/native-map-container';
import { ProfileProvider } from '../../providers/profile/profile';
import { ToastController } from 'ionic-angular';
import {TranslateService} from "ng2-translate";

@Injectable()
export class PopUpProvider {
  public onRequest: boolean = false;
  public mapComponent: any;
  public canDismiss: boolean = false;
  public calculateBtn: boolean = false;
  public price: number;
  public allowed: boolean = true;
  public uid: any;
  public hasCleared: boolean = false;
  public dismissLoader: any;

  constructor( protected injector: Injector, private toastCtrl: ToastController,
               public cMap: NativeMapContainerProvider,
               public alert: AlertController, public ph: ProfileProvider,
               public load: LoadingController, private translate: TranslateService) {

  }

  get navCtrl(): NavController {
    return this.injector.get(NavController);
  }

showAlert(title, subtitle){
    this.translate.get(['OK', 'CANCEL']).subscribe(translations => {
      let alert = this.alert.create({
        title: title,
        subTitle: subtitle,
        buttons: [ {
          text: translations.OK,
          role: 'cancel',
          handler: () => {
            this.cMap.map.setClickable(true)
          }
        },],
        enableBackdropDismiss: false
      });
      alert.present();
    });
}

presentToast(message) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

presentToast2(message) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

showPimp(title ){
    this.translate.get(['OK', 'CANCEL']).subscribe(translations => {
      let alert = this.alert.create({
        title: title,
        buttons: [ {
          text: translations.OK,
          role: 'cancel',
          handler: () => {
          }
        },],
        enableBackdropDismiss: false
      });
      alert.present();
    });
}

show(title ){
    this.translate.get(['OK', 'CANCEL']).subscribe(translations => {
      let alert = this.alert.create({
        title: title,
        buttons: [ {
          text: translations.OK,
          role: 'cancel',
          handler: () => {
            document.getElementById("destination").innerHTML = "Set A Closer Destination";
          }
        },],
        enableBackdropDismiss: false
      });
      alert.present();
    });
}

Send(id) {
    this.translate.get(['MESSAGE', 'CANCEL', 'SEND']).subscribe(translations => {
      let alert = this.alert.create({
        title: translations.MESSAGE,
        inputs: [
          {
            name: 'message',
            placeholder: translations.MESSAGE
          },
        ],
        buttons: [
          {
            text: translations.CANCEL,
            role: 'cancel',
            handler: data => {

            }
          },
          {
            text: translations.SEND,
            handler: data => {
              this.ph.SendMessage(data.message, id)
            }
          }
        ]
      });
      alert.present();
    });
}

refactor(){

        this.calculateBtn = false;
        document.getElementById("destination").innerHTML = "Set Destination";

}

presentLoader(message) {
  this.dismissLoader = this.load.create({
    content: message
  });
  this.dismissLoader.present();
}

hideLoader(){
  this.dismissLoader.dismiss();
}

}

import { Injectable, ViewChild, Injector} from '@angular/core';
import { AlertController, ModalController, LoadingController, Loading, NavController } from 'ionic-angular';
import { NativeMapContainerProvider } from '../../providers/native-map-container/native-map-container';
import { ProfileProvider } from '../../providers/profile/profile';

import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';

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

  constructor( protected injector: Injector, private toastCtrl: ToastController, public storage: Storage, public cMap: NativeMapContainerProvider,  public alert: AlertController, public ph: ProfileProvider, public load: LoadingController) {

  }

  get navCtrl(): NavController {
    return this.injector.get(NavController);
  }

showAlert(title, subtitle){
  let alert = this.alert.create({
    title: title,
    subTitle: subtitle,
    buttons: [ {
      text: "Okay",
      role: 'cancel',
      handler: () => {
      this.cMap.map.setClickable(true)
      }
    },],
    enableBackdropDismiss: false
  });
  alert.present();
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
  let alert = this.alert.create({
    title: title,
    buttons: [ {
      text: "Okay",
      role: 'cancel',
      handler: () => {
      }
    },],
    enableBackdropDismiss: false
  });
  alert.present();
}

show(title ){
  let alert = this.alert.create({
    title: title,
    buttons: [ {
      text: "Okay",
      role: 'cancel',
      handler: () => {
        document.getElementById("destination").innerHTML = "Set A Closer Destination";
      }
    },],
    enableBackdropDismiss: false
  });
  alert.present();
}

Send(id) {
  let alert = this.alert.create({
    title: 'Write Your Short Message',
    inputs: [
      {
        name: 'message',
        placeholder: 'Message'
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
      {
        text: 'Send',
        handler: data => {
          this.ph.SendMessage(data.message, id)
        }
      }
    ]
  });
  alert.present();
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

import { Injectable, ViewChild, Injector} from '@angular/core';
import { AlertController, ModalController, LoadingController, Loading, NavController } from 'ionic-angular';
import { NativeMapContainerProvider } from '../../providers/native-map-container/native-map-container';
import { ProfileProvider } from '../../providers/profile/profile';

import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { RatePage } from '../../pages/rate/rate';
import { ToastController } from 'ionic-angular';
/*
  Generated class for the PopUpProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
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

showAlertNormal(title, subtitle, network){
  let alert = this.alert.create({
    title: title,
    subTitle: subtitle,
    buttons: [ {
      text: "Try Again",
      role: 'cancel',
      handler: () => {
        if (network){
          this.clearAll(this.uid, true);
          }
      }
    },],
    enableBackdropDismiss: false 
  });
  alert.present();
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


pickup(){
  let alert = this.alert.create({
    title: "Have You Been Picked Up?",
    subTitle: "",
    buttons: [ {
      text: "No",
      role: 'cancel',
      handler: () => {
        this.ph.ApprovePickup(false, this.uid)
      }
    },
    {
      text: "Yes",
      handler: () => {
        this.ph.ApprovePickup(false, this.uid)
        this.allowed = false
       //picked up true, disable cancel of navigation
      }
    },],
    enableBackdropDismiss: false 
  });
  alert.present();
}






showPayMentAlert(title, subtitle, canLeave ){
  let alert = this.alert.create({
    title: title,
    subTitle: subtitle,
    buttons: [ {
      text: "Okay",
      role: 'cancel',
      handler: () => {
       if (canLeave){
        this.navCtrl.push(RatePage);
       }
      }
    },],
    enableBackdropDismiss: false 
  });
  alert.present();
}



showPomp(title, message ){
  let alert = this.alert.create({
    title: title,
    subTitle: message,
    buttons: [ {
      text: "Okay",
      role: 'cancel',
      handler: () => {
        this.clearAll(this.uid, true);
      }
    },],
    enableBackdropDismiss: false 
  });
  alert.present();
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
  
        this.cMap.onDestinatiobarHide = false;
        this.calculateBtn = false;
        document.getElementById("destination").innerHTML = "Set Destination";
   
}



GotoPage(){
  this.navCtrl.push(RatePage);
}

clearAll(uid, can){
  console.log(uid)
  let customer = firebase.database().ref(`Customer/${uid}`);
  customer.remove().then((success) =>{
    // this.cMap.toggleFlipAnim('flipped');
    // this.cMap.toggleFadeAnim('invisible');
    // this.cMap.toggleBounceAnim("out");
   
    this.cMap.onbar2 = false
    this.cMap.onbar3 = false
    this.cMap.isNavigate = false;
    this.cMap.map.clear().then(s=>{
      this.cMap.Reset();
     // this.presentRouteLoader("Cancelling..."); 
    });
    //this.cMap.element = this.mapComponent
    this.cMap.hasRequested = false;
    this.onRequest = false;
    this.cMap.toggleBtn = false;
    this.cMap.onPointerHide = false;
    this.cMap.onDestinatiobarHide = false;
    this.allowed = true;
    this.cMap.map.setClickable(true);
    document.getElementById("header").innerText = "Requesting A Ride";
    //this.cMap.map.setOptions({draggable: true});
    this.cMap.isCarAvailable = true;
    this.cMap.car_notificationIds = [];
    this.canDismiss = true
    this.storage.remove(`currentUserId`);
    this.cMap.cars = [];
  }).catch((error)=>{
   // this.showAlertNormal("Network Error", "please make sure you have a strong network and try Again", false)
  })
  
}


locatePosition(lat, lng){
 // this.cMap.map.setCenter(lat, lng);
}



presentRouteLoader(message) {
  let loading = this.load.create({
    content: message
  });

  loading.present();

  let myInterval = setInterval(() => {
  if (this.canDismiss){
    loading.dismiss();
    clearInterval(myInterval)
  }
    
  }, 1000);
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


showAlertComplex(title, message, accept, reject, iscancel){
  let alert = this.alert.create({
    title: title,
    message: message,
    inputs: [
      {
        name: 'long',
        label: 'Long Pickup',
        type: "checkbox",
        value: "true",
        checked: false
      },
      {
        name: 'incorrect',
        label: 'Incorrect Request',
        type: "checkbox",
        value: "false",
        checked: false
      }
    ],
    buttons: [
      {
        text: reject,
        role: 'cancel',
        handler: () => {
          
        }
      },
      {
        text: accept,
        handler: () => {
          if (iscancel){
            this.clearAll(this.uid, true);
          }
        }
      }
    ],
    enableBackdropDismiss: false 
  });
  alert.present();
}
  
}

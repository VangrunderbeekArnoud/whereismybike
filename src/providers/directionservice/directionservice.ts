import { Injectable } from '@angular/core';
import { PopUpProvider } from '../../providers/pop-up/pop-up';
import { EventProvider } from '../../providers/event/event';
import { GeocoderProvider } from '../../providers/geocoder/geocoder';
import { Platform, ModalController} from 'ionic-angular';
import { NativeMapContainerProvider } from '../../providers/native-map-container/native-map-container';
import firebase from 'firebase/app';
declare var google;
/*
  Generated class for the DirectionserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DirectionserviceProvider {
  public price: any;
  public time: any;
  public canDismiss: boolean = false;
  public name: string;
  public id : any;
  public locationName: any;
  public hasGottenTripDist: boolean = false;
  public calculateBtn: boolean = false;
  public  pricePerKm : any;
  public  fare : any ;
  appPrice: any;
  public canUpdateDestination: boolean = false;
  public isDriver: boolean = false;
  destinationName: any;
  public  service : any = new google.maps.DistanceMatrixService();
 
  constructor( private eProvider: EventProvider, public modalCtrl: ModalController, public platform: Platform, public cMap: NativeMapContainerProvider, public gCode: GeocoderProvider, public popOp: PopUpProvider) {
    console.log(this.fare)
  }

  calcRoute(start, stop, isDriver, canUpdateDestination, destinationName) {
     if (!this.platform.is('cordova')){
       start = new google.maps.LatLng(5.4966964, 7.5297323)
       this.gCode.locationName = 'Umuahia - Ikot Ekpene Rd, Umuahia, Nigeria'
     }

     if (this.calculateBtn){
  this.popOp.presentLoader('Calculating..')
     }
     
       this.service.getDistanceMatrix(
         {
           origins: [start, this.gCode.locationName],
           destinations: [destinationName, stop],
           travelMode: 'DRIVING',
           unitSystem: google.maps.UnitSystem.METRIC,
           avoidHighways: false,
           avoidTolls: false,
         }, (response, status) => {
           this.callback(response, status)
         })
      
         this.isDriver = isDriver;
         this.canUpdateDestination = canUpdateDestination;
         this.destinationName = destinationName
   
  }

  callback(response, status) {
    // See Parsing the Results for
    // the basics of a callback function.
    console.log(response, status);
    
  
   
    if (status == 'OK'){
      // loading.present();
    if (response.rows[0].elements[1].status == 'ZERO_RESULTS' || response.rows[0].elements[1].status == 'NOT_FOUND'){
      this.popOp.showPimp('Wrong destination add another')
    }else{
    
      let fareTime = Math.floor(response.rows[0].elements[1].duration.value/60) * 5.5
      this.price = Math.floor(response.rows[0].elements[1].distance.value/1000) * this.pricePerKm + this.fare + fareTime;
      //this.popOp.price  = this.price;
      console.log('im here in dprovider' + this.pricePerKm , this.fare , fareTime)
      this.time = response.rows[0].elements[1].duration.text;

      
      if (this.calculateBtn){
        let obj = {charge: this.price };
        let modal = this.modalCtrl.create('EstimateResultPage', obj);
        modal.present();
        modal.onDidDismiss(data => {
          this.popOp.refactor()
        })
     // this.popOp.showEstimateAlert("Price Estimate is NGN " + this.price + ' At NGN 55/Km ', "However, this may vary due to Weather or Traffic conditions ")
      // console.log('Estimate Cal:' + start, stop);
      this.calculateBtn = false;
      this.popOp.hideLoader()
      } 

      if (this.isDriver){
       document.getElementById("header").innerText = "Driver Arrives In " + this.time;
      //  loading.dismiss()
     }

     console.log('started the update destination');

     if (this.canUpdateDestination){
      //  loading.dismiss()
    
       this.UpdateInformation(this.destinationName, this.price);
     }
      
     console.log(response.rows[0].elements[1].distance.value/1000, response.rows[0].elements[1].duration.value, response.rows[0].elements[1].duration.text)
    }
  }
  }


  UpdateInformation(destinationName: string, price: any){
    this.eProvider.UpdateDestination(destinationName, price, this.id).then(success => {
     this.popOp.showPimp('Destination Set');
    }).catch(error =>{})
  }


}

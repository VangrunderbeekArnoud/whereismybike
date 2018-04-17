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

}

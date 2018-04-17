import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventProvider {
  public userProfileRef:firebase.database.Reference;
  public CustomerRef:firebase.database.Reference;
  public id: any;
  public customerId: any;
  public CustomerOwnPropertyRef: firebase.database.Reference;
  public selected_driver: any;
  public appPrice: any;
  public fare: any;
 public pricePerKm: any;

  constructor() {
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        this.id = user.uid

        this.userProfileRef = firebase.database().ref(`users/${user.uid}`);
       // this.CustomerRef = firebase.database().ref(`Customer/${this.selected_driver}`);
        this.CustomerOwnPropertyRef = firebase.database().ref(`Customer/${user.uid}/client`);
      }
    });
  }
}

import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class SigfoxProvider {
  public userProfile:firebase.database.Reference;
  public devicesProfile:firebase.database.Reference;
  public user: any;
  public sigfoxID: any;
  public name: any;
  public brand: any;
  public type: any;
  public number: any;
  public pic: any;
  public test: boolean = true;

  constructor() {
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        //console.log(user);
        this.user = user;
        this.userProfile = firebase.database().ref(`users/${user.uid}`);
        this.devicesProfile = firebase.database().ref(`users/${user.uid}/devices`);
        this.getUserProfile().on('value', userProfileSnapshot => {
        });
        this.getDevicesProfile().on('value', devicesProfileSnapshot => {
          this.sigfoxID = devicesProfileSnapshot.val().sigfoxID;
          this.name = devicesProfileSnapshot.val().name;
          this.brand = devicesProfileSnapshot.val().brand;
          this.type = devicesProfileSnapshot.val().type;
          this.number = devicesProfileSnapshot.val().number;
          this.pic = devicesProfileSnapshot.val().picture;
        })
      }
    });
  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  getDevicesProfile(): firebase.database.Reference {
    return this.devicesProfile;
  }

  updateSigfoxID(sigfoxID: string): firebase.Promise<void> {
    return this.devicesProfile.update({
      sigfoxID: sigfoxID,
    });
  }
  updateName(name: string): firebase.Promise<void> {
    return this.devicesProfile.update({
      name: name,
    });
  }
  updateBrand(brand: string): firebase.Promise<void> {
    return this.devicesProfile.update({
      brand: brand,
    });
  }
  updateType(type: string): firebase.Promise<void> {
    return this.devicesProfile.update({
      type: type,
    });
  }
  updateNumber(number: string): firebase.Promise<void> {
    return this.devicesProfile.update({
      number: number,
    });
  }
}

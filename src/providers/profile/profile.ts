import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {SigfoxProvider} from "../sigfox/sigfox";

@Injectable()
export class ProfileProvider {
  public userProfile:firebase.database.Reference;
  public customer:firebase.database.Reference;
  public devicesProfile:firebase.database.Reference;
  public user: any;
  public phone: number;
  public name: any;
  public card: any;
  public email: any;
  public cvc: any;
  public home: any;
  public work: any;
  public verificationID: any;
  public year: any;
  public month: any;
  public isHome: boolean = true;
  public pic: any;
  public id: any;
  public uid: any;
  constructor(private sigfox: SigfoxProvider) {
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        this.user = user;
        this.id = this.user.uid;
        this.userProfile = firebase.database().ref(`users/${user.uid}`);
        this.devicesProfile = firebase.database().ref(`users/${user.uid}/devices`);
        this.userListeners();
        this.deviceListeners();
      }
    });
  }
  userListeners() {
    this.getUserProfile().on('value', userProfileSnapshot => {
      //this.userProfile = userProfileSnapshot.val();
      this.phone = userProfileSnapshot.val().phoneNumber;
      this.pic = userProfileSnapshot.val().picture;
      this.verificationID = userProfileSnapshot.val().random;
      this.name = userProfileSnapshot.val().name;
    });
  }
  deviceListeners() {
    this.getDevices().on('child_added', snapshot => {
      let sigfoxID = snapshot.val().sigfoxID;
      this.sigfox.getDeviceBattery(sigfoxID).on('value', snap => {
        this.updateDeviceBattery(sigfoxID, snap.val());
      });
      this.sigfox.getDeviceLocationGps(sigfoxID).on('value', snap => {
        this.updateDeviceLocation(sigfoxID, snap.val().lat, snap.val().lng);
      });
      this.getDevice(sigfoxID).on('value', snap => {
        if ( (snap.val() == null)) {
          this.sigfox.getDeviceLocationGps(sigfoxID).off();
          this.sigfox.getDeviceBattery(sigfoxID).off();
        }
      });
    });
  }
  updateDeviceBattery(sigfoxID: any, battery: any) {
    this.getDevice(sigfoxID).update({
      battery: battery
    });
  }
  updateDeviceLocation(sigfoxID: any, lat: any, lng: any) {
    this.getDevice(sigfoxID).update({
      lat: lat,
      lng: lng
    });
  }
  updateDeviceName(device: any, name: string): firebase.Promise<void> {
    return device.update({
      name: name
    });
  }
  updateDeviceBrand(device: any, brand: string): firebase.Promise<void> {
    return device.update({
      brand: brand
    });
  }
  updateDeviceType(device: any, type: string): firebase.Promise<void> {
    return device.update({
      type: type
    });
  }
  updateDeviceNumber(device: any, number: string): firebase.Promise<void> {
    return device.update({
      number: number
    });
  }
  getDevice(sigfoxID: string): firebase.database.Reference {
    return firebase.database().ref(`users/${this.user.uid}/devices/${sigfoxID}`);
  }
  getDevices(): firebase.database.Reference {
    return firebase.database().ref(`users/${this.user.uid}/devices`)
  }
  deviceExists(id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getDevice(id).once('value', snapshot => {
        if ( snapshot.exists()) {
          resolve(true);
        } else resolve(false);
      });
    });
  }
  addDevice(sigfoxID: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.sigfox.deviceExists(sigfoxID).then((res1) => {
        if ( res1) {
          this.deviceExists(sigfoxID).then((res2) => {
            if ( res2) {
              resolve(2); // Device already exist
            } else {
              this.devicesProfile.child('/' + sigfoxID).update({
                sigfoxID: sigfoxID
              });
              resolve(0); // Correct
            }
          });
        } else {
          resolve(1); // Please enter a valid device ID
        }
      });
    });
  }
  deleteDevice(device: any) {
    device.off();
    device.remove().then( f => {
      console.log(f);
    });
  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  getName(): firebase.database.Reference {
    return this.userProfile.child('name');
  }
  updateName(username: string): firebase.Promise<void> {
    return this.userProfile.update({
      name: username,
    });
  }

  UpdateNumber(
    number: number): firebase.Promise<any> {
    return this.userProfile.update({
      phoneNumber: number,
    });
  }

  UpdatePhoto(
    pic: any): firebase.Promise<any> {
    return this.userProfile.update({
      picture: pic,
    });
  }
  UpdateDevicePhoto(device: any, pic: any): firebase.Promise<any> {
    return device.update({
      picture: pic
    });
  }

  Complain(
    value: any): firebase.Promise<any> {
    return  firebase.database().ref(`dashboard/complains`).push({
      complain: value,
      email: this.user.email,
      phoneNumber: this.phone
    });
  }

  SendMessage(value: string, id: any): firebase.Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_Message: value,
    });
  }

}

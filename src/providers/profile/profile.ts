import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {SigfoxProvider} from "../sigfox/sigfox";

@Injectable()
export class ProfileProvider {
  public userProfile:firebase.database.Reference;
  public devicesProfile:firebase.database.Reference;
  public phone: number;
  public name: any;
  public email: any;
  public isHome: boolean = true;
  public pic: any;
  public id: any;
  public user: boolean = true;
  constructor(private sigfox: SigfoxProvider) {
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        this.id = user.uid;
        this.userProfile = firebase.database().ref(`users/${user.uid}`);
        this.devicesProfile = firebase.database().ref(`users/${user.uid}/devices`);
        this.userListeners();
        this.deviceListeners();
      }
    });
  }
  // user
  // ====================================================================================
  userListeners() {
    this.getUserProfile().on('value', snapshot => {
      this.email = snapshot.val().email;
      this.phone = snapshot.val().phoneNumber;
      this.pic = snapshot.val().picture;
      this.name = snapshot.val().name;
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
  Complain(
    value: any): firebase.Promise<any> {
    return  firebase.database().ref(`dashboard/complains`).push({
      complain: value,
      email: this.email,
      phoneNumber: this.phone
    });
  }
  SendMessage(value: string, id: any): firebase.Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_Message: value,
    });
  }

  // devices
  // ====================================================================================
  deviceListeners() {
    this.getDevices().on('child_added', snapshot => {
      let sigfoxID = snapshot.key;
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
    this.getDevice(sigfoxID).child('location').update({
      lat: lat,
      lng: lng
    });
  }
  updateDeviceLock(sigfoxID: any, lock: boolean): firebase.Promise<void> {
    return this.getDevice(sigfoxID).child('lock').update({
      status: lock
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
    return firebase.database().ref(`users/${this.id}/devices/${sigfoxID}`);
  }
  getDevices(): firebase.database.Reference {
    return firebase.database().ref(`users/${this.id}/devices`)
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
                lock: {
                  status: false
                }
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

  UpdateDevicePhoto(device: any, pic: any): firebase.Promise<any> {
    return device.update({
      picture: pic
    });
  }


}

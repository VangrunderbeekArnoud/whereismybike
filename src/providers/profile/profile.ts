import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {SigfoxProvider} from "../sigfox/sigfox";

@Injectable()
export class ProfileProvider {
  public userProfile:firebase.database.Reference;
  public customer:firebase.database.Reference;
  public devicesProfile:firebase.database.Reference;
  public currentUser:firebase.User;
  public user: any;
  public phone: number;
  public appPrice: any;
  public drivers: any;
  public name: any;
  public CustomerOwnPropertyRef: firebase.database.Reference;
  public driver: any;
  public userOtherProfile: any;
  public paymentType: any;
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
  public fare: any;
  public pricePerKm: any;
  public devices: Array<any> = [];
  constructor(private sigfox: SigfoxProvider) {
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        //console.log(user)
        this.user = user;
        //console.log(this.user)
        this.id = this.user.uid;
        this.userProfile = firebase.database().ref(`users/${user.uid}`);
        this.appPrice = firebase.database().ref(`dashboard`);
        this.userOtherProfile = firebase.database().ref(`driverProfile/${user.uid}`);

        this.getUserOtherProfile().on('value', userProfileSnapshot => {
          this.driver = userProfileSnapshot.val()
         })


        this.drivers = firebase.database().ref(`Drivers`);
        this.CustomerOwnPropertyRef = firebase.database().ref(`Customer/${user.uid}/client`);
        this.devicesProfile = firebase.database().ref(`users/${user.uid}/devices`);

        this.getUserProfile().on('value', userProfileSnapshot => {
         //this.userProfile = userProfileSnapshot.val();
         this.phone = userProfileSnapshot.val().phoneNumber;
         this.pic = userProfileSnapshot.val().picture;
         this.verificationID = userProfileSnapshot.val().random;
         this.name = userProfileSnapshot.val().name;
         this.paymentType = userProfileSnapshot.val().payWith;
         this.card = userProfileSnapshot.val().Card_Number;
         this.email = userProfileSnapshot.val().Card_email;
         this.cvc = userProfileSnapshot.val().Card_Cvc;
         this.year = userProfileSnapshot.val().Card_Year;
         this.month = userProfileSnapshot.val().Card_month;

         console.log(this.phone)
        });
        this.deviceListeners();
      }
    });
  }
  deviceListeners() {
    this.getDevices().on('child_added', snapshot => {
      console.log('a child is added');
      this.sigfox.getDeviceBattery(snapshot.val().sigfoxID).on('value', snap => {
        console.log('battery changed: ' + snap.val());
        this.updateDeviceBattery(snapshot.val().sigfoxID, snap.val());
      });
      this.sigfox.getDeviceLocationGps(snapshot.val().sigfoxID).on('value', snap => {
        this.updateDeviceLocation(snapshot.val().sigfoxID, snap.val().lat, snap.val().lng);
      });
      this.getDevice(snapshot.val().sigfoxID).on('value', snap => {
        if ( !(snap.val() == null)) {
          console.log('child_changed');

        } else {
          console.log('child_removed');
          this.sigfox.getDeviceLocationGps(snapshot.val().sigfoxID).off();
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
  addDevice(sigfoxID: string) {
    this.devicesProfile.child('/' + sigfoxID).update({
      sigfoxID: sigfoxID,
    });
  }
  deleteDevice(device: any) {
    // device.off()
    device.remove().then( f => {
      console.log(f);
    });
  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  getUserOtherProfile(): firebase.database.Reference {
    return this.userOtherProfile;
  }


  getUserAsClientInfo(): firebase.database.Reference {
    return this.customer;
  }

  getAllDrivers(): firebase.database.Reference {
    return this.drivers;
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

  UpdateHome(
    number: number): firebase.Promise<any> {
    return this.userProfile.update({
      Home: number,
    });
  }


  UpdateWork(
    number: number): firebase.Promise<any> {
    return this.userProfile.update({
      Work: number,
    });
  }

  updateDestination(
    number: number): firebase.Promise<any> {
    return this.userProfile.update({
      Work: number,
    });
  }


  createHistory(name: string, price: number, date: any,
    location: number, destination: number): firebase.Promise<any> {
    return this.userProfile.child('/eventList').push({
      name: name,
      price: price,
      date: date,
      location: location,
      destination: destination
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

  PushRandomNumber(
    number: number): firebase.Promise<any> {
    return this.userProfile.update({
      random: number,
    });
  }

  Complain(
    value: any): firebase.Promise<any> {
    return  firebase.database().ref(`dashboard/complains`).push({
      complain: value,
      email: this.user.email
    });
  }


  RateDriver(id: any, rScore: any, text: any, value: boolean): firebase.Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_HasRated: value,
      Client_RateValue: rScore,
      Client_RateText: text
    });
  }

  ApprovePickup(value: boolean, id: any): firebase.Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_PickedUp: value,
    });
  }

  ApproveDrop(value: boolean, id: any): firebase.Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_Dropped: value,
    });
  }

  SendMessage(value: string, id: any): firebase.Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_Message: value,
    });
  }

  CanCharge(value: boolean, id: any): firebase.Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_CanChargeCard: value,
    });
  }


  UpdatePaymentType(
    number: number): firebase.Promise<any> {
    return this.userProfile.update({
      payWith: number,
    });
  }


}

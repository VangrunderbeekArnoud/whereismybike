import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class SigfoxProvider {
  private devices: firebase.database.Reference;

  constructor() {
    this.devices = firebase.database().ref(`devices`);
  }
  getDevices(): firebase.database.Reference {
    return this.devices;
  }
  getDevice(id: any): firebase.database.Reference {
    return this.devices.child(id);
  }
  deviceExists(id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.devices.child(id).once('value', snapshot => {
        if ( snapshot.exists()) {
          resolve(true);
        } else resolve(false);
      });
    });
  }
  getDeviceLocationGps(id: any): firebase.database.Reference {
    return this.devices.child(id).child('location').child('gps');
  }
  getDeviceLocationSigfox(id: any): firebase.database.Reference {
    return this.devices.child(id).child('location').child('sigfox');
  }
  getDeviceAvgSnr(id: any): firebase.database.Reference {
    return this.devices.child(id).child('avgSnr');
  }
  getDeviceBattery(id: any): firebase.database.Reference {
    return this.devices.child(id).child('battery');
  }
  getDeviceData(id: any): firebase.database.Reference {
    return this.devices.child(id).child('data');
  }
  getDeviceDuplicate(id: any): firebase.database.Reference {
    return this.devices.child(id).child('duplicate');
  }
  getDeviceRssi(id: any): firebase.database.Reference {
    return this.devices.child(id).child('rssi');
  }
  getDeviceSeqNumber(id: any): firebase.database.Reference {
    return this.devices.child(id).child('seqNumber');
  }
  getDeviceSnr(id: any): firebase.database.Reference {
    return this.devices.child(id).child('snr');
  }
  getDeviceStation(id: any): firebase.database.Reference {
    return this.devices.child(id).child('station');
  }
  getDeviceTime(id: any): firebase.database.Reference {
    return this.devices.child(id).child('time');
  }

}

@Injectable()
export class VirtualSigfoxProvider {

  constructor(private sigfox: SigfoxProvider) {
    this.addDevices();
  }

  addDevices() {
    console.log('Virtual Sigfox devices added !');
    this.addDevice('1', 46.65, 75,'33125917050b333e',false, {gps: {lat: 50.8616995, lng: 4.6726563}, sigfox: {lat: 51.0, lng: 5.0}},-132.00, 280, 28.34, '10C9', 1523222264);
    this.addDevice('2', 46.65, 32,'33125917050b333e',false, {gps: {lat: 50.7616995, lng: 4.7706563}, sigfox: {lat: 51.0, lng: 5.0}},-132.00, 280, 28.34, '10C9', 1523222264);
    this.addDevice('3', 46.65, 98,'33125917050b333e',false, {gps: {lat: 50.9610995, lng: 4.5716563}, sigfox: {lat: 51.0, lng: 5.0}},-132.00, 280, 28.34, '10C9', 1523222264);
    this.addDevice('4', 46.65, 12,'33125917050b333e',false, {gps: {lat: 50.9626995, lng: 4.6716563}, sigfox: {lat: 51.0, lng: 5.0}},-132.00, 280, 28.34, '10C9', 1523222264);

    this.addDevice('5', 46.65, 12,'33125917050b333e',false, {gps: {lat: 50.8526995, lng: 4.6616563}, sigfox: {lat: 51.0, lng: 5.0}},-132.00, 280, 28.34, '10C9', 1523222264);
    this.addDevice('6', 46.65, 12,'33125917050b333e',false, {gps: {lat: 50.8726995, lng: 4.6516563}, sigfox: {lat: 51.0, lng: 5.0}},-132.00, 280, 28.34, '10C9', 1523222264);
    this.addDevice('7', 46.65, 12,'33125917050b333e',false, {gps: {lat: 50.8426995, lng: 4.6816563}, sigfox: {lat: 51.0, lng: 5.0}},-132.00, 280, 28.34, '10C9', 1523222264);
    this.addDevice('8', 46.65, 12,'33125917050b333e',false, {gps: {lat: 50.8826995, lng: 4.6916563}, sigfox: {lat: 51.0, lng: 5.0}},-132.00, 280, 28.34, '10C9', 1523222264);
    this.addDevice('9', 46.65, 12,'33125917050b333e',false, {gps: {lat: 50.6526995, lng: 4.6616563}, sigfox: {lat: 51.0, lng: 5.0}},-132.00, 280, 28.34, '10C9', 1523222264);
    this.addDevice('10', 46.65, 12,'33125917050b333e',false, {gps: {lat: 50.8726995, lng: 4.6716563}, sigfox: {lat: 51.0, lng: 5.0}},-132.00, 280, 28.34, '10C9', 1523222264);
  }
  addDevice(name: string, avgSnr: any, battery: any, data: any, duplicate: boolean, location: any, rssi: any, seqNumber: number, snr: any, station: string, time: any) {
    let device = firebase.database().ref(`devices/${name}`);
    device.set({
      avgSnr: avgSnr,
      battery: battery,
      data: data,
      duplicate: duplicate,
      rssi: rssi,
      location: {
        gps: {
          lat: location.gps.lat,
          lng: location.gps.lng
        },
        sigfox: {
          lat: location.sigfox.lat,
          lng: location.sigfox.lng
        }
      },
      seqNumber: seqNumber,
      snr: snr,
      station: station,
      time: time
    });
  }

}

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
  getDeviceLocationGps(id: any): firebase.database.Reference {
    return this.devices.child(id).child('location').child('gps');
  }
  getDeviceLocationSigfox(id: any): firebase.database.Reference {
    return this.devices.child(id).child('location').child('sigfox');
  }
  getDeviceAvgSnr(id: any): firebase.database.Reference {
    return this.devices.child(id).child('avgSnr');
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

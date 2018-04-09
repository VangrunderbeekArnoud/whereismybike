import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class SigfoxProvider {
  public devices: firebase.database.Reference;

  constructor() {
    this.devices = firebase.database().ref(`devices`);
  }

  getDevice(id: any): firebase.database.Reference {
    return this.devices.child(id);
  }
}

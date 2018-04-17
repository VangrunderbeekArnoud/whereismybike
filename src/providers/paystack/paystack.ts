import { Injectable, Injector } from '@angular/core';
import { Platform } from 'ionic-angular';
import { PopUpProvider } from '../../providers/pop-up/pop-up';
import { EventProvider } from '../../providers/event/event';
import { ProfileProvider } from '../../providers/profile/profile';
/*
  Generated class for the PaystackProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PaystackProvider {
  constructor( private ph: ProfileProvider, public eProvider: EventProvider, public platform: Platform, public pop: PopUpProvider) {

  }
}

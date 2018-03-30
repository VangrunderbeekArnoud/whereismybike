import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { IonicPage } from 'ionic-angular';
import { PopUpProvider } from '../../providers/pop-up/pop-up';
@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  public eventList: Array<any>;

  constructor(public navCtrl: NavController, public pop: PopUpProvider, public load: LoadingController, public eventProvider: EventProvider) {}

  ionViewDidEnter() {
    this.pop.presentLoader('Retrieving all items..')
    this.eventProvider.getEventList().on('value', snapshot => {
      this.eventList = [];
      this.pop.hideLoader()
      snapshot.forEach( snap => {
        this.eventList.push({
          id: snap.key,
          name: snap.val().name,
          price: snap.val().price,
          date: snap.val().date,
          location: snap.val().location,
          destination: snap.val().destination
        });
        return false
      });
    });


    
  }

  goToEventDetail(eventId){
  this.navCtrl.push('HistoryDetailsPage', { 'eventId': eventId });
  }


}
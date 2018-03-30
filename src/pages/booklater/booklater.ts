import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, ModalController, ActionSheetController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { PopUpProvider } from '../../providers/pop-up/pop-up';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DatePicker } from '@ionic-native/date-picker';
/**
 * Generated class for the BooklaterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booklater',
  templateUrl: 'booklater.html',
})
export class BooklaterPage {
  public eventList: Array<any>;
  constructor(public navCtrl: NavController, public datePicker: DatePicker, public localNotif: LocalNotifications, public pop: PopUpProvider, public eventProvider: EventProvider, private modalCtrl: ModalController) {
  }

  ionViewDidEnter() {
    this.eventProvider.getScheduledList().on('value', snapshot => {
      this.eventList = [];
      snapshot.forEach( snap => {
        this.eventList.push({
          id: snap.key,
          date: snap.val().TimeandDate,
        });
        return false
      });
    });
    
  }



  Pickachu(){
  this.datePicker.show({
    date: new Date(),
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
  }).then(date =>{
    this.createSchedule(date)
    console.log(date)
  });

}


createSchedule(date){
  this.eventProvider.CreateNewSchedule(date).then(sec =>{
    console.log(date)
    this.pop.showPimp('Ride Scheduled Successfully')
    this.localNotif.schedule({
      text: 'You Scheduled A Ride Today',
      at: date,
      led: 'FF0000',
      sound: null
   });
  })
}


}

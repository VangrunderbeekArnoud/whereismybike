import {Component, NgZone} from '@angular/core';
import {ViewController, NavController} from 'ionic-angular';
declare let google;
import { ProfileProvider } from '../../providers/profile/profile';
import { IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  templateUrl: 'autocomplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;
  home: any;
  work: any;
  service = new google.maps.places.AutocompleteService();

  constructor (public viewCtrl: ViewController,  private navCtrl: NavController, private ph: ProfileProvider, private zone: NgZone) {
    this.autocompleteItems = []

    //import home and work from the database
    ph.getUserProfile().on('value', userProfileSnapshot => {
      this.home = userProfileSnapshot.val().Home;
      this.work = userProfileSnapshot.val().Work;
    });
    
    this.autocomplete = {
      query: ''
    };

  }

//goto settings function 
  gotoSetting(){
    this.navCtrl.push('ProfilePage')
  }

  //choose home option btn
  chooseHome(){
    if (this.home == null)
    this.viewCtrl.dismiss();
    else
    this.viewCtrl.dismiss(this.home);
  }

  //choose work option btn
  chooseWork(){
    if (this.work == null)
    this.viewCtrl.dismiss();
    else
    this.viewCtrl.dismiss(this.work);
  
  }


  //dismiss the modal 
  dismiss() {
    this.viewCtrl.dismiss();
  }

  //choose a particular option
  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
    this.ph.isHome = true
  }
  

  //update search each time the search option is changed.
  updateSearch() {
    this.ph.isHome = false
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;

    //You can change 'NG' below to your desired country code to get search specific for that country.
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: {country: 'NG'} }, (predictions, status) => {
      me.autocompleteItems = []; 
      me.zone.run( () => {
        predictions.forEach( (prediction) => {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }
}
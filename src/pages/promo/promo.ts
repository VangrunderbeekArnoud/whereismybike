import { Component } from '@angular/core';
import {  NavParams, LoadingController, Loading,
  AlertController, NavController, Platform  } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProfileProvider } from '../../providers/profile/profile';
import { IonicPage } from 'ionic-angular';
import { PopUpProvider } from '../../providers/pop-up/pop-up';
import { EventProvider } from '../../providers/event/event';
@IonicPage()
/**
 * Generated class for the PromoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-promo',
  templateUrl: 'promo.html',
})
export class PromoPage {

  public cardpaymentForm: FormGroup;
  loading: Loading;

  constructor(public prof: ProfileProvider, public pop: PopUpProvider, public eProvider: EventProvider, public platform: Platform, public nav: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, 
    public formBuilder: FormBuilder) {

      this.cardpaymentForm = formBuilder.group({
        card: ['', Validators.compose([Validators.maxLength(16), Validators.minLength(16), Validators.required])],
      });
  }


  IonViewDidLoad() {
    
  }


   AddCard(): void{
    this.pop.showAlert('Add Your Card','Add a card to use promo codes')
   }

}

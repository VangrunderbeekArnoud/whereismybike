import {Component} from '@angular/core';
import {
  NavController,
  MenuController,
  ModalController,
  Platform,
  AlertController,
  LoadingController
} from 'ionic-angular';
import {EventProvider} from '../../providers/event/event';
import {NativeMapContainerProvider} from '../../providers/native-map-container/native-map-container';
import {ProfileProvider} from '../../providers/profile/profile';
import {PopUpProvider} from '../../providers/pop-up/pop-up';
import {DirectionserviceProvider} from '../../providers/directionservice/directionservice';
import {OnesignalProvider} from '../../providers/onesignal/onesignal';
import {GeocoderProvider} from '../../providers/geocoder/geocoder';
import {CallNumber} from '@ionic-native/call-number';
import * as firebase from 'firebase/app';
import {Storage} from '@ionic/storage';
import {Vibration} from '@ionic-native/vibration';
import {IonicPage} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {BackgroundMode} from '@ionic-native/background-mode';
declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [NativeMapContainerProvider, ProfileProvider, PopUpProvider,
    DirectionserviceProvider, OnesignalProvider, GeocoderProvider],
})

export class HomePage {
  public location;
  public name;
  public picture;
  public number;
  returningUser: boolean = false;
  started: boolean = false;
  uid: any;
  startedNavigation: boolean = false;
  destinationSetName: any;
  added: boolean = true;
  type: any = 'arrow-dropdown';
  lat: any;
  lng: any;
  price: any;

  constructor(public storage: Storage, private backgroundMode: BackgroundMode,
              public stB: StatusBar, public loadingCtrl: LoadingController,
              private vibration: Vibration, public alert: AlertController,
              public cMap: NativeMapContainerProvider, private call: CallNumber,
              public myGcode: GeocoderProvider, public dProvider: DirectionserviceProvider,
              public platform: Platform, public OneSignal: OnesignalProvider,
              public modalCtrl: ModalController, public menu: MenuController,
              public pop: PopUpProvider, public ph: ProfileProvider,
              public navCtrl: NavController, public eventProvider: EventProvider) {
    menu.swipeEnable(false, 'menu1');
    ph.isHome = true
  }

  ngOnInit() {
    //detecting authentication changes in firebase.
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      // As a measure to use lazy loading you will first be redirected to home page if
      // you are not a user then go to login page. But if its a user then check if the
      // user has a phone number if so then instantiate the map.
      if (!user) {
        this.navCtrl.setRoot('LoginEntrancePage');
        unsubscribe();
        this.stB.hide();
      } else {
        unsubscribe();
        this.cMap.loadMap();
        this.ph.getUserProfile().on('value', userProfileSnapshot => {
          if (userProfileSnapshot.val().phoneNumber == null || userProfileSnapshot.val().phoneNumber == undefined) {
            this.navCtrl.setRoot('PhonePage');
          }
          this.stB.hide();
          //wait for the map to get your current location.
          this.WaitForGeolocation();
          if (this.platform.is('cordova')) {
            //  this.SmartLoader('Please Wait..   If this is taking too long, Please check Your Connection')
          }
        })
      }
    });

  }

  WaitForGeolocation() {
    //A timer to detect if the location has been found.
    let location_tracker_loop = setTimeout(() => {
      if (this.cMap.hasShown) {
        clearTimeout(location_tracker_loop);
        this.showMap();
      } else {
        this.WaitForGeolocation()
      }
    }, 1000)
  }

  showMap() {
    //display the map set variables for better access
    this.lat = this.cMap.lat;
    this.lng = this.cMap.lng;
    //Check if user already has a connection, maybe lost due to unexpected device shut down and application exit
    this.CheckForPreviousData();
  }

  //Check if there is a key available in the storage, if not, return. This is to ensure that we dont lose information
  //If the user mistakenly closes the application.
  CheckForPreviousData() {
    this.storage.get('currentUserId').then((value) => {
      if (value != null) {
        this.uid = value;
        this.hideFunctions();
        this.returningUser = true;
        this.pop.uid = this.uid;
        this.dProvider.id = this.uid;
      } else {
        this.storage.remove(`currentUserId`);
      }

    }).catch(er => {
      console.log("error")
    });

  }

  hideFunctions() {
    ///hide and remove some properties on user request.
    let bottomBar1 = document.getElementById("bar2").style.display = 'none'
    this.cMap.onbar2 = true
    clearTimeout(this.cMap.timer1)
    let centerBar = document.getElementById("onbar")
    centerBar.style.display = 'none'

    document.getElementById("destination").innerHTML = 'Set Destination';
    this.cMap.map.setCameraZoom(6);
    this.startedNavigation = true;
    this.pop.onRequest = true;
    this.cMap.hasRequested = true;
    this.dProvider.calculateBtn = false;

    this.ph.getAllDrivers().off("child_added");
    this.ph.getAllDrivers().off("child_changed");
    this.cMap.map.clear();
  }

  showAddressModal(selectedBar) {
    clearTimeout(this.cMap.timer1)
    console.log(this.myGcode.locationName)
    let modal = this.modalCtrl.create('AutocompletePage');
    modal.onDidDismiss(data => {
      //Open the address modal on location bar click to change location
      console.log(data)
      if (selectedBar == 1 && data != null) {
        if (!this.startedNavigation) {
          document.getElementById("location").innerText = data;
          this.myGcode.locationName = data
          this.cMap.RefreshMap(data)
        }
      }
      //Open the address modal on destination bar click to change destination
      if (selectedBar == 2 && data != null) {
        document.getElementById("destination").innerText = data;
        this.destinationSetName = data
        let myPos = new google.maps.LatLng(this.cMap.lat, this.cMap.lng)
        ///After data input, check to see if user selected to add a destination or to calculate distance.
        this.myGcode.geocoder.geocode({'address': data}, (results, status) => {
          if (status == 'OK') {
            var position = results[0].geometry.location
            let calPos = new google.maps.LatLng(position.lat(), position.lng())
            if (!this.dProvider.calculateBtn) {
              this.dProvider.calcRoute(myPos, calPos, false, true, data)
              console.log('started the destination input' + data);

            } else {
              console.log(data);
              this.dProvider.calcRoute(myPos, calPos, false, false, data)
            }
          } else {

          }
        });

      }
    });
    modal.present();
  }

}

import {Component} from '@angular/core';
import {
  NavController,
  MenuController,
  ModalController,
  Platform,
  AlertController,
  LoadingController
} from 'ionic-angular';
import {NativeMapContainerProvider} from '../../providers/native-map-container/native-map-container';
import {ProfileProvider} from '../../providers/profile/profile';
import {PopUpProvider} from '../../providers/pop-up/pop-up';
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
    OnesignalProvider, GeocoderProvider],
})

export class HomePage {
  public picture;
  public number;
  public selector: boolean = false;
  public devices: Array<any>;
  public height: Number;
  public scroll: boolean = false;
  started: boolean = false;
  uid: any;
  startedNavigation: boolean = false;
  added: boolean = true;
  type: any = 'arrow-dropdown';
  lat: any;
  lng: any;
  private name: any;

  constructor(public storage: Storage, private backgroundMode: BackgroundMode,
              public stB: StatusBar, public loadingCtrl: LoadingController,
              private vibration: Vibration, public alert: AlertController,
              public cMap: NativeMapContainerProvider, private call: CallNumber,
              public myGcode: GeocoderProvider,
              public platform: Platform, public OneSignal: OnesignalProvider,
              public modalCtrl: ModalController, public menu: MenuController,
              public pop: PopUpProvider, public ph: ProfileProvider,
              public navCtrl: NavController) {
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
        document.getElementById("location").innerText = ' ';
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
          this.name = this.ph.name;
          this.loadDevices();
        })
      }
    });
  }
  loadDevices() {
    this.ph.getDevices().on('value', snapshot => {
      this.devices = [];
      snapshot.forEach(snap => {
        this.devices.push({
          sigfoxID: snap.val().sigfoxID,
          name: snap.val().name,
          brand: snap.val().brand,
          type: snap.val().type,
          number: snap.val().number,
          pic: snap.val().picture,
          photoURL: snap.val().photoURL,
          lat: snap.val().lat,
          lng: snap.val().lng
        });
        return false;
      });
    });
  }

  showSelectDevice() {
    if ( this.selector) {
      this.selector = false;
    } else {
      var length = (this.devices.length +1)*10;
      if ( length <= 60) {
        this.height = length;
        this.scroll = false;
      } else {
        this.height = 60;
        this.scroll = true;
      }
      this.selector = true;
    }
  }
  setLocation(name, lat, lng) {
    this.name = name;
    this.cMap.setLocation({lat: lat, lng: lng});
    this.selector = false;
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
    let centerBar = document.getElementById("onbar")
    centerBar.style.display = 'none'
  }
}

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
  private name: any;
  private sigfoxID: any;
  private lat: any;
  private lng: any;

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
        this.ph.getUserReference().once('value', snapshot => { // it was on, now once !
          if (snapshot.val().phone == null || snapshot.val().phone == undefined) {
            this.navCtrl.setRoot('PhonePage');
          }
          this.stB.hide();
          //wait for the map to get your current location.
          this.WaitForGeolocation();
          if (this.platform.is('cordova')) {
            //  this.SmartLoader('Please Wait..   If this is taking too long, Please check Your Connection')
          }
          this.name = this.ph.user.name;
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
          sigfoxID: snap.key,
          name: snap.val().name,
          brand: snap.val().brand,
          type: snap.val().type,
          number: snap.val().number,
          pic: snap.val().picture,
          photoURL: snap.val().photoURL,
          location: {
            lat: snap.child('location').child('lat').val(),
            lng: snap.child('location').child('lng').val()
          },
          lock: {
            status: snap.child('lock').child('status').val()
          }
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
  setLocation(name, sigfoxID, lat, lng) {
    this.name = name;
    this.sigfoxID = sigfoxID;
    this.lat = lat;
    this.lng = lng;
    this.cMap.setLocation({lat: lat, lng: lng});
    this.selector = false;
  }
  lock() {
    this.selector = false;
    if ( this.sigfoxID == null) { // the user is selected
      this.setLocation(this.name, this.sigfoxID, this.lat, this.lng);
      this.pop.presentToast('Cannot lock the user!');
    } else { // a device is selected
      this.ph.getDevice(this.sigfoxID).once('value', snapshot => {
        this.setLocation(snapshot.val().name, snapshot.key, snapshot.child('location').child('lat').val(), snapshot.child('location').child('lng').val());
        if ( snapshot.child('lock').child('status').val()) {
          this.ph.updateDeviceLock(snapshot.key,false);
          this.pop.presentToast('Bike is unlocked!');
        } else {
          this.ph.updateDeviceLock(snapshot.key, true);
          this.pop.presentToast('Bike is locked!');
        }
      });
    }
  }
  WaitForGeolocation() {
    //A timer to detect if the location has been found.
    let location_tracker_loop = setTimeout(() => {
      if (this.cMap.hasShown) {
        clearTimeout(location_tracker_loop);
      } else {
        this.WaitForGeolocation()
      }
    }, 1000)
  }

}

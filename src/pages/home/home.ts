import {Component} from '@angular/core';
import {
  NavController,
  MenuController,
  Platform,
} from 'ionic-angular';
import {NativeMapContainerProvider} from '../../providers/native-map-container/native-map-container';
import {ProfileProvider} from '../../providers/profile/profile';
import {PopUpProvider} from '../../providers/pop-up/pop-up';
import {OnesignalProvider} from '../../providers/onesignal/onesignal';
import {GeocoderProvider} from '../../providers/geocoder/geocoder';
import * as firebase from 'firebase/app';
import {Storage} from '@ionic/storage';
import {Vibration} from '@ionic-native/vibration';
import {IonicPage} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {TranslateService} from "ng2-translate";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {NetworkProvider} from "../../providers/network/network";

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

  constructor(public storage: Storage,
              public statusBar: StatusBar,
              private vibration: Vibration,
              public cMap: NativeMapContainerProvider,
              public platform: Platform, private network: NetworkProvider,
              public menu: MenuController, private analytics: AnalyticsProvider,
              public pop: PopUpProvider, public ph: ProfileProvider,
              public navCtrl: NavController, private translate: TranslateService) {
    menu.swipeEnable(false, 'menu1');
    ph.isHome = true
  }
  ionViewDidEnter() {
    this.analytics.page('HomePage');
  }
  ngOnInit() {
    //detecting authentication changes in firebase.
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      // As a measure to use lazy loading you will first be redirected to home page if
      // you are not a user then go to login page. But if its a user then check if the
      // user has a phone number if so then instantiate the map.
      if (!user) {
        this.statusBar.hide();
        this.navCtrl.setRoot('LoginEntrancePage');
        unsubscribe();
      } else {
        this.statusBar.show();
        unsubscribe();
        document.getElementById("location").innerText = this.ph.user.name;
        this.cMap.loadMap();
        this.ph.getUserReference().once('value', snapshot => { // it was on, now once !
          if (snapshot.val().phone == null || snapshot.val().phone == undefined) {
            this.statusBar.hide();
            this.navCtrl.setRoot('PhonePage');
          }
          //wait for the map to get your current location.
          this.WaitForGeolocation();
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
      try {
        var length = (this.devices.length +1)*10;
        if ( length <= 60) {
          this.height = length;
          this.scroll = false;
        } else {
          this.height = 60;
          this.scroll = true;
        }
        this.selector = true;
      } catch(err) {
        console.log('showselectDevice error');
        this.translate.get('NO_NETWORK').subscribe(translation => {
          this.pop.presentToast(translation);
        });
      }
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
      this.translate.get('USERNLOCK').subscribe(translation => {
        this.pop.presentToast(translation);
      });
    } else { // a device is selected
      if ( this.network.connected) {
        this.ph.getDevice(this.sigfoxID).once('value', snapshot => {
          this.setLocation(snapshot.val().name, snapshot.key, snapshot.child('location').child('lat').val(), snapshot.child('location').child('lng').val());
          if ( snapshot.child('lock').child('status').val()) {
            this.ph.updateDeviceLock(snapshot.key,false);
            this.vibration.vibrate(200);
            this.translate.get('BIKENLOCK').subscribe(translation => {
              this.pop.presentToast(translation);
            });
          } else {
            this.ph.updateDeviceLock(snapshot.key, true);
            this.vibration.vibrate(200);
            this.translate.get('BIKELOCK').subscribe(translation => {
              this.pop.presentToast(translation);
            });
          }
        });
      } else {
        this.translate.get('NO_NETWORK').subscribe(translation => {
          this.pop.presentToast(translation);
        });
      }
    }
    this.analytics.event('lock', {foo: 'bar'});
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

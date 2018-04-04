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
// import { Geolocation } from '@ionic-native/geolocation';
import * as firebase from 'firebase/app';
import {Storage} from '@ionic/storage';
import {Vibration} from '@ionic-native/vibration';
import {IonicPage} from 'ionic-angular';
import {RatePage} from '../../pages/rate/rate';
import {StatusBar} from '@ionic-native/status-bar';
import {BackgroundMode} from '@ionic-native/background-mode';
// import { Content } from 'ionic-angular';
declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [NativeMapContainerProvider, ProfileProvider, PopUpProvider, DirectionserviceProvider, OnesignalProvider, GeocoderProvider],
})

export class HomePage {
  // @ViewChild(Content) content: Content;
  userProfile: any;
  public location;
  public plate;
  public carType;
  public name;
  public seat;
  public rating;
  public picture;
  public waitingToLog: boolean = true;
  public number;
  public hasAlreadyStarted: boolean = false;
  public hideTopbuttons: boolean = false;
  public canStopCheck: boolean = false;
  public canStop: boolean = false
  public onGpsEnabled: boolean = true;
  public toggleMore: boolean = true;
  public toggleNav: boolean = true;
  public choseCar: boolean = false;
  public bookStarted: boolean = false;
  userDestName: any;
  returningUser: boolean = false;
  started: boolean = false;
  NotifyTimes: number = -1;
  timerBeforeNotify: number = 30000;
  timeTonotify: any;
  uid: any;
  driverLocationName: any;
  startedNavigation: boolean = false;
  destinationSetName: any;
  added: boolean = true;
  type: any = 'arrow-dropdown';
  lat: any;
  lng: any;
  price: any;

  constructor(public storage: Storage, private backgroundMode: BackgroundMode, public stB: StatusBar, public loadingCtrl: LoadingController, private vibration: Vibration, public alert: AlertController, public cMap: NativeMapContainerProvider, private call: CallNumber, public myGcode: GeocoderProvider, public dProvider: DirectionserviceProvider, public platform: Platform, public OneSignal: OnesignalProvider, public modalCtrl: ModalController, public menu: MenuController, public pop: PopUpProvider, public ph: ProfileProvider, public navCtrl: NavController, public eventProvider: EventProvider) {
    menu.swipeEnable(false, 'menu1');
    ph.isHome = true
  }

  ngOnInit() {
    //detecting authentication changes in firebase.
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      //As a measure to use lazy loading you will first be redirected to home page if
      //You are not a user then go to login page.
      //But if its a user then check if the user has a phone number if so then instantiate the map.
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

          if (!this.hasAlreadyStarted) {
            this.stB.hide();
            //this.stB.show();
            this.waitingToLog = false;
            if (!this.platform.is('cordova')) {
              this.cMap.showDriversWithoutCordova();
            }


            //var otherDatabaseInfo = firebase.database().ref(`dashboard`);
            //otherDatabaseInfo.on('value', userProfileSnapshot => {
            //this.dProvider.fare = userProfileSnapshot.val().price;
            //this.dProvider.pricePerKm = userProfileSnapshot.val().perkm;
            //})


          }
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
        console.log("We now have geolocation : connected");
      } else {
        this.WaitForGeolocation()
        console.log("We are still waiting for geolocation!");
      }
    }, 1000)
  }


  bookLater() {
    //show or hide more button on connecting with driver.
    this.navCtrl.push('BooklaterPage');
  }


  toggleMoreBtn() {
    //show or hide more button on connecting with driver.
    this.toggleMore = this.toggleMore ? false : true
    if (this.toggleMore) {
      this.type = 'arrow-dropdown'
    } else {
      this.type = 'arrow-dropup'
    }
  }

  showMap() {
    //display the map set variables for better access
    this.lat = this.cMap.lat;
    this.lng = this.cMap.lng;

    //Check if user already has a connection, maybe lost due to unexpected device shut down and application exit
    this.CheckForPreviousData();
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


//This is the fuction for estimate btn.
  estimate() {
    this.cMap.onDestinatiobarHide = true;
    this.dProvider.calculateBtn = true;
  }


  //Check if there is a key available in the storage, if not, return. This is to ensure that we dont lose information
  //If the user mistakenly closes the application.
  CheckForPreviousData() {
    this.storage.get('currentUserId').then((value) => {
      if (value != null) {
        this.uid = value;
        this.startWaitingForResponse();
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


  pickLocation() {
    // if (!this.cMap.isNoDriver){
    let bottomBar1 = document.getElementById("bar2").style.display = 'block'
    // }else{
    this.cMap.choseCar = false
    // }
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
    this.cMap.isCarAvailable = false;
    this.dProvider.calculateBtn = false;

    this.ph.getAllDrivers().off("child_added");
    this.ph.getAllDrivers().off("child_changed");
    this.cMap.map.clear();
  }


  ///The Book Now button onclick=>Create and push the users information to the database.
  StartListeningForChanges() {
    console.log('started listening again');
    this.bookStarted = true
    this.hideFunctions()
    this.returningUser = false;
    var image = this.ph.user.photoURL
    var name = this.ph.user.displayName
    var pay = this.ph.paymentType
    this.pop.calculateBtn = false;
    clearTimeout(this.cMap.timer1)


    if (image == null) {
      if (this.ph.pic == null) {
        image = 'https://cdn1.iconfinder.com/data/icons/instagram-ui-glyph/48/Sed-10-128.png'
      } else {
        image = this.ph.pic
      }

    }

    if (name == null) {
      if (this.ph.name != null) {
        name = this.ph.name
      } else {
        name = this.ph.user.email
      }

    }

    if (pay == null) {
      pay = 1
    }

    if (this.platform.is('cordova')) {
      if (this.cMap.lat == null && this.cMap.lng == null) {
        var pos = this.cMap.location;
        this.cMap.lng = pos.lng;
        this.cMap.lat = pos.lat;
      }
    }

    if (!this.platform.is('cordova')) {

      console.log(name, image, 5.4966964, 7.5297323, 'Umuahia - Ikot Ekpene Rd, Umuahia, Nigeria', pay);
      this.createUserInformation(name, image, 5.4966964, 7.5297323, 'Umuahia - Ikot Ekpene Rd, Umuahia, Nigeria', pay);
    } else {
      this.createUserInformation(name, image, this.cMap.lat, this.cMap.lng, this.myGcode.locationName, pay);
    }
  }


  //clear the booking request
  cancelRequest() {
    clearTimeout(this.timeTonotify);
    this.NotifyTimes = -1;
    if (this.pop.allowed)
      this.pop.showAlertComplex('Why Do You Want To Cancel?', 'Please Choose An Option', 'Ok', 'Cancel', true)
  }

  //goto payment page on cash or card click
  gotoPayment() {
    this.navCtrl.push('PaymentPage');
  }

  //share the ride btn
  ShareRide() {

  }


  createUserInformation(name: string, picture: any,
                        lat: number, lng: number, locationName: any, payWith: any) {

    ////Here we check if there are cars available, if none we return
    ///If there are cars available, then we check the distance between the car and the user
    ///If its not close enough we return
    ///If its close enough we send the push to the driver.If we dont get a reponse in 60 seconds
    ///We push the details to another close driver, but return if no more drivers.

    this.pop.hasCleared = false;
    this.NotifyTimes++

    //Driver id represents the drivers details. the notifytimes represents the number of times to notify, which increases or decreases as a result of the number of drivers available at the momne
    let driver_id = this.cMap.car_notificationIds[this.NotifyTimes];
    console.log(driver_id)
    console.log(this.NotifyTimes, this.cMap.car_notificationIds[this.NotifyTimes])

    console.log(this.cMap.car_notificationIds.length)

    //Check if number of notifytimes is less than the number of cars/drivers
    if (this.NotifyTimes < this.cMap.car_notificationIds.length) {

      let current_drivers_position = new google.maps.LatLng(driver_id[0], driver_id[1])
      let users_position;
      if (!this.platform.is('cordova')) {
        users_position = new google.maps.LatLng(5.4966964, 7.5297323)
      } else {
        users_position = new google.maps.LatLng(this.cMap.lat, this.cMap.lng)
      }

      let apart = google.maps.geometry.spherical.computeDistanceBetween(current_drivers_position, users_position) / 60

      //This checks if the location of the driver is within 100 meters from that of the user
      if (apart <= 100) {
        //This confirms if there is actually a location cordinate presented by the driver
        if (driver_id[2] != null) {

          //This represents the drivers information for access to the driver node in the database
          let selected_driver = driver_id[2].toString();
          let selected_drivers_key = driver_id[3].toString();

          console.log(selected_driver);

          //Registering selected variables to providers for later use
          this.pop.uid = selected_driver;
          this.dProvider.id = selected_driver;
          this.uid = selected_driver;

          let dest = 'Waiting For Input..';
          if (this.destinationSetName != null) {
            dest = this.destinationSetName
          }

          //Get access to the drivers database node, remove the current driver from the node and push, to avoid any other request on the same driver
          let driver = firebase.database().ref(`Drivers/${selected_drivers_key}`);
          driver.remove().then((id) => {
            console.log(selected_drivers_key)

            //Push the drivers information to the customer connection node in the database
            let CustomerRef = firebase.database().ref(`Customer/${selected_driver}`);
            return CustomerRef.child("/client").set({
              Client_username: name,
              Client_Deleted: false,
              Client_location: [lat, lng],
              Client_locationName: locationName,
              Client_paymentForm: payWith,
              Client_picture: picture,
              Client_phoneNumber: this.ph.phone,
              Client_destinationName: dest,
              Client_CanChargeCard: false,
              Client_PickedUp: false,
              Client_Dropped: false,
              Client_HasRated: false

            }).then(suc => {
              //After removing the driver from the driver node we can then create a push notification to this driver
            })

          })
        } else {
          clearTimeout(this.timeTonotify);
          this.pop.clearAll(this.uid, true);
          this.pop.hasCleared = true;
          console.log(this.NotifyTimes);
          this.pop.show('All Our Drivers Are Busy, Please Try Again. Sorry For The Incovenience.')
          this.NotifyTimes = -1;
        }
      } else {

        //if the driver is not close enough to the user then remove the call and start again with a closer driver
        this.RecreateInfoAndPush()
        console.log('not compatible')


      }
    } else {
      clearTimeout(this.timeTonotify);
      this.pop.clearAll(this.uid, true);
      this.pop.hasCleared = true;
      this.NotifyTimes = -1;
      console.log(this.NotifyTimes);
      this.cMap.map.setClickable(false)
      if (this.bookStarted)
        this.bookStarted = false
      this.pop.showAlert('No Cars Nearby', 'It seems no cars close to you at the moment. Please dont be dissapointed we are working to have cars available, in the whole of Nigeria.')
    }
  }

  ClearInformation() {
    let customer = firebase.database().ref(`Customer/${this.uid}`);
    customer.remove().then((success) => {
      this.returningUser = false;
      var image = this.ph.user.photoURL;
      var name = this.ph.user.displayName;
      var edited_name = this.ph.name;
      var pay = this.ph.paymentType;
      this.pop.calculateBtn = false;

      if (image == null) {
        if (this.ph.pic == null) {
          image = 'https://cdn1.iconfinder.com/data/icons/instagram-ui-glyph/48/Sed-10-128.png'
        } else {
          image = this.ph.pic
        }

      }

      if (name == null) {
        if (edited_name != null) {
          name = edited_name
        } else {
          name = this.ph.user.email
        }
      }

      if (pay == null) {
        pay = 1
      }

      if (this.cMap.lat == null && this.cMap.lng == null) {
        this.cMap.lat = this.lat
        this.cMap.lng = this.lng
      }

      if (!this.platform.is('cordova')) {
        this.createUserInformation(name, image, 5.4966964, 7.5297323, 'Umuahia - Ikot Ekpene Rd, Umuahia, Nigeria', pay);
      } else {
        this.createUserInformation(name, image, this.cMap.lat, this.cMap.lng, this.myGcode.locationName, pay);
      }


    })
  }

//create the information again and push to the database.
  RecreateInfoAndPush() {
    var image = this.ph.user.photoURL;
    var name = this.ph.user.displayName;
    var pay = this.ph.paymentType;
    this.pop.calculateBtn = false;


    if (image == null) {
      if (this.ph.pic == null) {
        image = 'https://cdn1.iconfinder.com/data/icons/instagram-ui-glyph/48/Sed-10-128.png'
      } else {
        image = this.ph.pic
      }

    }

    if (name == null) {
      name = this.ph.user.email
    }

    if (pay == null) {
      pay = 1
    }

    if (this.cMap.lat == null && this.cMap.lng == null) {
      this.cMap.lat = this.lat
      this.cMap.lng = this.lng
    }

    if (!this.platform.is('cordova')) {
      this.createUserInformation(name, image, 5.4966964, 7.5297323, 'Umuahia - Ikot Ekpene Rd, Umuahia, Nigeria', pay);
    } else {
      this.createUserInformation(name, image, this.cMap.lat, this.cMap.lng, this.myGcode.locationName, pay);
    }

  }


  ///Here we listen for any changes in the DB
  startWaitingForResponse() {
    this.backgroundMode.enable();
    var connectedRef = firebase.database().ref(".info/connected");
    let CustomerRef = firebase.database().ref(`Customer/${this.uid}/`);
    let connect_change = true
    let picked_up = true
    let driver_picked = false
    let dropped = true
    let rated = true
    let deleted = false

    //avoid accidental application
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => this.pop.presentToast('Sorry! cant exit at this time'));
    })


    //
    CustomerRef.on('child_added', customerSnapshot => {

      if (this.returningUser) {
        if (customerSnapshot.val().Driver_location) {
          this.presentRouteLoader('Waiting...');
          this.vibration.vibrate(1000);
          this.DriverFound(customerSnapshot.val().Driver_location,
            customerSnapshot.val().Driver_plate,
            customerSnapshot.val().Driver_carType,
            customerSnapshot.val().Driver_name,
            customerSnapshot.val().Driver_seat,
            customerSnapshot.val().Driver_locationName,
            customerSnapshot.val().Driver_rating,
            customerSnapshot.val().Driver_picture,
            customerSnapshot.val().Driver_number,
            customerSnapshot.val().Client_locationName,
            customerSnapshot.val().Client_location[0],
            customerSnapshot.val().Client_location[1]
          );

          this.cMap.onDestinatiobarHide = true;
          document.getElementById("destination").innerText = customerSnapshot.val().Client_destinationName;
          ;

        }

        let driverPos = new google.maps.LatLng(customerSnapshot.val().Driver_location[0], customerSnapshot.val().Driver_location[1])
        let userPos = new google.maps.LatLng(customerSnapshot.val().Client_location[0], customerSnapshot.val().Client_location[1])
        this.dProvider.calcRoute(userPos, driverPos, true, false, 'ghjtfd')
      }
    });


    CustomerRef.on('child_changed', customerSnapshot => {

      if (customerSnapshot.val().Client_PickedUp && picked_up) {
        this.presentRouteLoader('Waiting...');
        this.cMap.map.setClickable(false)
        clearInterval(this.cMap.detectCarChange);
        this.cMap.toggleBtn = false;
        driver_picked = true;
        document.getElementById("header").innerHTML = "Your Journey Has Started.";
        this.hideTopbuttons = true;
        if (!this.toggleMore)
          this.toggleMore = false;

        if (customerSnapshot.val().Client_price == null) {

          this.cMap.toggleBtn = false;
          picked_up = false;

        }

      }

      if (customerSnapshot.val().Client_Deleted && deleted) {
        deleted = false
        this.pop.clearAll(this.uid, true)
      }

      if (customerSnapshot.val().Client_Dropped && dropped) {
        document.getElementById("header").innerHTML = "Your Journey Has Ended.";
        if (!customerSnapshot.val().Client_CanChargeCard) {
          this.ph.CanCharge(true, this.uid);
          this.ph.uid = this.uid
          dropped = false;
        }
        this.presentRouteLoader('Waiting...');
      }

      if (customerSnapshot.val().Client_CanChargeCard) {


        if (!customerSnapshot.val().Client_HasRated && rated) {
          if (this.ph.card != null) {
            this.cMap.map.setClickable(false)

            this.price = customerSnapshot.val().Client_price;
            let location = customerSnapshot.val().Client_locationName;
            let destination = customerSnapshot.val().Client_destinationName;
            let obj = {id: this.uid, from: location, to: destination, charge: this.price};
            let modal = this.modalCtrl.create('PaymentApprovalPage', obj);
            modal.present();
            modal.onDidDismiss(data => {
              this.cMap.map.setClickable(true)
              this.ChargeCard(this.ph.card, this.ph.month, this.ph.cvc, this.ph.year, this.price, this.ph.email)
            })


          } else {
            this.cMap.map.setClickable(false)

            this.price = customerSnapshot.val().Client_price;
            let location = customerSnapshot.val().Client_locationName;
            let destination = customerSnapshot.val().Client_destinationName;
            let obj = {id: this.uid, from: location, to: destination, charge: this.price};
            let modal = this.modalCtrl.create('PaymentApprovalPage', obj);
            modal.present();
            modal.onDidDismiss(data => {
              this.cMap.map.setClickable(true)

              this.navCtrl.push(RatePage, {'eventId': this.uid});
            })
          }
          rated = false
        }
      }

      if (connect_change) {
        this.presentRouteLoader('Driver Found')
        this.vibration.vibrate(1000);
        this.backgroundMode.setDefaults({
          title: 'Taxihub',
          text: "Driver Arrives In " + this.dProvider.time,
          bigText: true,
          hidden: false,
        })
        connect_change = false
        this.pop.uid = this.uid
        this.eventProvider.UpdateSate(true, this.uid);
        this.DriverFound(customerSnapshot.val().Driver_location,
          customerSnapshot.val().Driver_plate,
          customerSnapshot.val().Driver_carType,
          customerSnapshot.val().Driver_name,
          customerSnapshot.val().Driver_seats,
          customerSnapshot.val().Driver_locationName,
          customerSnapshot.val().Driver_rating,
          customerSnapshot.val().Driver_picture,
          customerSnapshot.val().Driver_number,
          customerSnapshot.val().Client_locationName,
          customerSnapshot.val().Client_location[0],
          customerSnapshot.val().Client_location[1]
        )
        document.getElementById("destination").innerHTML = 'Set Destination';
        this.storage.set(`currentUserId`, this.uid)
        this.cMap.onDestinatiobarHide = true;

      }


      this.userDestName = customerSnapshot.val().Client_destinationName;
      this.dProvider.name = customerSnapshot.val().Driver_name;
      this.number = customerSnapshot.val().Driver_number
      this.pop.uid = this.uid
      if (customerSnapshot.val().Client_HasRated) {
        this.presentRouteLoader('Waiting...')
        var currentdate = new Date(new Date().getTime() + 3600)
        this.ph.createHistory(this.name, this.price, currentdate, this.myGcode.locationName, this.userDestName).then(suc => {
          this.pop.clearAll(this.uid, true);
          this.pop.hasCleared = true;
        });


      }


      this.cMap.D_lat = customerSnapshot.val().Driver_location[0]
      this.cMap.D_lng = customerSnapshot.val().Driver_location[1]

      let userPos = new google.maps.LatLng(customerSnapshot.val().Client_location[0], customerSnapshot.val().Client_location[1])
      let driverPos = new google.maps.LatLng(customerSnapshot.val().Driver_location[0], customerSnapshot.val().Driver_location[1])
      console.log(this.myGcode.locationName, customerSnapshot.val().Driver_locationName)
      this.driverLocationName = customerSnapshot.val().Driver_locationName

      if (!driver_picked) {
        this.dProvider.calcRoute(userPos, driverPos, true, false, 'wertyrw')
      }

    });

    CustomerRef.on('child_removed', customerSnapshot => {
      this.startedNavigation = false;
      this.storage.remove(`currentUserId`);
      connect_change = true;

      this.bookStarted = false
      this.hideTopbuttons = false
      this.cMap.map.setClickable(true)

      this.platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => this.platform.exitApp());
      })
      this.backgroundMode.disable()

    });

    ///check to make sure there is network connection.
    connectedRef.on("value", (snap) => {

      if (snap.val() === true) {
        this.eventProvider.UpdateNetworkSate(true, this.uid);
        this.pop.hideLoader()
      } else {
        this.pop.presentLoader("Connection Lost!. Please connect to the Internet. Trying to connect...");
        this.eventProvider.UpdateNetworkSate(false, this.uid);
      }
    });

  }


  showPayCash(title) {
    let alert = this.alert.create({
      title: title,
      subTitle: "Please Setup Your Card",
      buttons: [{
        text: "Okay",
        role: 'cancel',
        handler: () => {
          this.navCtrl.push(RatePage, {'eventId': this.uid});
        }
      },],
      enableBackdropDismiss: false
    });
    alert.present();
  }


  hideFunctionsOnDriverFound() {
    this.cMap.onbar2 = false
    this.cMap.onbar3 = true

    this.cMap.toggleBtn = true;
    this.cMap.onPointerHide = true;

    this.cMap.car_notificationIds = [];
    clearTimeout(this.timeTonotify)
    this.NotifyTimes = -1
  }


  DriverFound(location, plate, carType, name, seat, locationName, rating, picture, number, userPos, client_lat, client_lng): Promise<any> {
    this.location = location;
    this.plate = plate;
    this.carType = carType;
    this.name = name;
    this.seat = seat;
    this.rating = rating;
    this.picture = picture;
    this.presentRouteLoader('Waiting...');
    this.hideFunctionsOnDriverFound();

    this.cMap.lat = client_lat;
    this.cMap.lng = client_lng;

    this.cMap.D_lat = location[0]
    this.cMap.D_lng = location[1]


    this.cMap.setMarkers(location, this.uid)
    return
  }


  ChargeCard(card, month, cvc, year, amount, email) {
    let loading = this.loadingCtrl.create({
      content: 'Processing Charge...'
    });

    loading.present();
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        // Now safe to use device APIs
        (<any>window).window.PaystackPlugin.chargeCard(
          (resp) => {
            loading.dismiss();
            //this.pop.showPayMentAlert("Payment Was Successful", "We will Now Refund Your Balance");
            console.log('charge successful: ', resp);
            this.navCtrl.push(RatePage, {'eventId': this.uid});
          },
          (resp) => {
            loading.dismiss();
            this.showPayMentErrorAlert('We Encountered An Error While Charging Your Card, #' + this.price)
          },
          {
            cardNumber: card,
            expiryMonth: month,
            expiryYear: year,
            cvc: cvc,
            email: email,
            amountInKobo: amount,
          });
      } else {

      }
    })


  }


  showPayAlert(price) {
    let alert = this.alert.create({
      title: 'Charge For This Trip is ' + price,
      subTitle: 'From ' + this.myGcode.locationName + ' To ' + this.userDestName + ' at 55 NGN per | KM.',
      buttons: [
        {
          text: "Checkout",
          handler: () => {


          }
        },],
      enableBackdropDismiss: false
    });
    alert.present();
  }


  showPayMentErrorAlert(title) {
    let alert = this.alert.create({
      title: title,
      subTitle: "",
      buttons: [
        {
          text: "Okay",
          handler: () => {

            this.navCtrl.push(RatePage, {'eventId': this.uid});

          }
        },],
      enableBackdropDismiss: false
    });
    alert.present();
  }


  SmartLoader(message) {
    let loading = this.loadingCtrl.create({
      content: message
    });

    loading.present();

    let myInterval = setInterval(() => {


      if (this.ph.phone != null) {
        loading.dismiss();
        clearInterval(myInterval)
      }


    }, 500);
  }


  presentRouteLoader(message) {
    let loading = this.loadingCtrl.create({
      content: message
    });

    loading.present();

    let myInterval = setTimeout(() => {
      loading.dismiss();

      clearTimeout(myInterval)

    }, 500);
  }


}

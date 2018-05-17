import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform} from 'ionic-angular';
import {GeocoderProvider} from '../../providers/geocoder/geocoder';
import {ProfileProvider} from '../../providers/profile/profile';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Marker,
  LocationService,
  MyLocation
} from '@ionic-native/google-maps';
import {SigfoxProvider} from "../sigfox/sigfox";
import {Geolocation} from '@ionic-native/geolocation';

declare var google: any;

@Injectable()
export class NativeMapContainerProvider {
  public onLocationbarHide: boolean = true;
  public lat: any;
  public lng: any;
  public client: any;
  public delay: number = 100;
  public uid: any
  locations: any;
  location: any;
  public userLocation: any;
  map: GoogleMap;
  public classic: boolean = false;
  public onbar2: boolean = false;
  canCheck: boolean = true;
  public hasShown: boolean = false;
  ready: boolean = false;
  private startLocation: any = {lat: 46.1634787, lng: 104.3458401}; // Mongolie

  constructor(private googleMaps: GoogleMaps, public ph: ProfileProvider,
              public gcode: GeocoderProvider, public platform: Platform,
              private geolocation: Geolocation, public sigfox: SigfoxProvider) {
  }

  ///Start the cordova map
  loadMap() {
    if ( this.platform.is('cordova')) {
      let mapOptions: GoogleMapOptions = { camera: {
          target: this.startLocation,
          zoom: 5,
          tilt: 0
        }, controls: {
          'myLocationButton': false,
          'mapToolbar': false
        }
      };
      this.map = GoogleMaps.create(document.getElementById("map"), mapOptions); // this.googleMaps.create() changed to GoogleMaps.create because of deprecated.
      console.log('Google maps created!');
      this.map.one(GoogleMapsEvent.MAP_READY) // run MAP_READY before using any methods
        .then(() => {
          console.log('Google maps ready!');
          this.map.setClickable(false);
          this.map.setCompassEnabled(false);
          this.map.setTrafficEnabled(false);
          this.map.setIndoorEnabled(false);
          this.addUserToMap();
          this.addDevicesToMap();
          this.map.setClickable(true);
          //this.hasShown = true;
          this.map.setClickable(true)
        }).catch(error => console.log(error));
    }
  }
  addUserToMap() {
    this.platform.ready().then( () => {
      if ( this.platform.is('cordova')) {
        this.geolocation.getCurrentPosition({timeout:500})
          .then(location => {
            this.map.addMarker({
              icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEcUlEQVRIS7WVfUxVZRzHf7/nuQx8QZJLEC81MXpZsjSuZOrEc869CDhoZTW16GXiRXvbrCxa/lFuQdqLmE5mMuacq1Z3gxISHPc8B1dopGEMxlTYNZp6s4WUFl2unOdp5+DFc4GL9EdnO9vdOc/9fH+/7+/lIPzPF96Ej7mS5OCIRQIxi3OeZJynAL8iIe0c4BBj7BQAiEiciAK5suy8JsR7lJBsrutXgJB2iug3QBwgRej6A4TSWQjQhkKUNWva0YlExgk4HI6o2bGxOwQhLwEAQyHeHxZCbWlpGbYCJEmyEUJyAaAMAZYj5zuHAV4fey5MwIDfEhf3Jdf1FcRmK1VV9bPJ0r8uiE6n8xkQYi8ANMTb7Ws8Ho8eCiZMwCVJu3Uh1tkIWdGsaa1Tqf/iwicfjNYDF6MCA3dyxCYuRJWmaa+NEzA854heQCxWVfXTqcCz1m5Wfk5fVT3zSt+lub7aVbZ/fl8pEGsAMUdV1W8NRigDlCSpjRJyVWXMNQVbwID3pRXV9KflzDF6aM7pgydmnDuanxj0fU0QicrY0lGBXElayAk5gULkezXtiPEiLy8veZjSWPXw4bNjszHh6UU1/ckj8NB9T8dHx5PPNeyghHi4EAs0TeswM3DK8lbO+SaBaDe6YNHDa5Mu3P1o7bXouBm3d9cVn6zb2xUSMeFzi2r6U8LhMX/7A2m+r7bcdb5+T2Bw8DJSWsEYKzcFFEWpF0LM1DRNdjxRGjeQuqTZN//ZbCOytDP13Um+hjU/evZ1Zj29Wem744YtocgNeEZXdWXXwbffMniSJB0jhPgZY4+ZApIk/WAjpHeY83W/ZK4+4svemGNNPaX3m+64/tObfkvM3hfyfBT+lz+Q0XkDbjqiKB4ASDHqECbgZeypee6KD3uyN7wcjI6PsorEn2/TL6csouYzPuJ7TAh+YCTy0DVOwClJhwQhsxhjknEo012+qydr/fND0xNtVhHr75ir/kBGR3Vl1xh4yCJK6UVVVR83M3Apyju6rr8SKrLxbF5J+Z6ehe7S4PRbx4mY8FMTwwsKCqKDQ0MDgPiuqqoVpoAsyw6CeFIArGSMNYZSvW99eVWvw+22isT8GRlu+u90PgJC1CEh93u93s7RQXMpynEOEGCMydZByyzZWnU2+wV3cFqCLeYPfyDjp+rKrv3hnlvsNwa2FRF1TdOWWScZcmV5OUdsAcTnVFU9YC3avRu27bqULpeknmn6eBI4uGS5VCB+IgCWMsaOhQmYtZCkSkHIRiJE/tj9vrRg9UOtjV98H2lHKYqiCF1vpJRWehl7c8Jtaux4SsjnAFCIQrzo1bT9U9hL6JJlt875bkJpbbzdXhxxXV9vMRsibieIr3IhvgOADxISEpo8Hk/QGr3ZLcFgga7rb1BCFiPA9tl2+xYrfJxFYcPidC4DIbYBwBKu64MCsYMScsE4o3OeSglZAADTjCAQsSzk+VgLb/bRN1p4PiIWAkAWAtxmAka+ze2IWG+0YqS6TJrBZH/6L+/+BedwGDdvfYzpAAAAAElFTkSuQmCC",
              position: {lat: location.coords.latitude, lng: location.coords.longitude},
            })
              .then(marker => {
                this.ph.getUserNameReference().on('value', snapshot => {
                  marker.setTitle(snapshot.val());
                });
                this.geolocation.watchPosition().subscribe(location => {
                  marker.setPosition({lat:location.coords.latitude,lng:location.coords.longitude});
                  this.location = {lat:location.coords.latitude,lng:location.coords.longitude};
                  this.userLocation = {lat:location.coords.latitude,lng:location.coords.longitude};
                });
                this.setLocation({lat:location.coords.latitude,lng:location.coords.longitude});
                this.location = {lat:location.coords.latitude,lng:location.coords.longitude};
                this.userLocation = {lat:location.coords.latitude,lng:location.coords.longitude};
              });
          }).catch(error => {
          console.log(error);
        });
      }
    });
  }
  addDevicesToMap() {
    this.platform.ready().then(() => {
      this.ph.getDevices().on('child_added', snapshot => {
        this.addMarker(snapshot);
        this.addCircle(snapshot, 60);
      });
    });
  }
  addMarker(device) {
    let sigfoxID = device.key;
    let location = { lat: device.child('location').child('lat').val(), lng: device.child('location').child('lng').val()};
    this.map.addMarker({
      title: device.val().name,
      position: location,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAaCAYAAADFTB7LAAAAgXpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjaVY5dCoBACITfPUVHGH9y1+MEFXSDjp+LUewH6ig6SMd9nbQMGCBbW/dwR2JhIVuKjkIBFvComYu3KqeSFHv1pFLCozfYv2iYWeHdz2YZeaKQQyWj1tKDMF6I30C+b+Y5b7MxPZxBK23T36MtAAAKAmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjQwIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjYiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iNDAiCiAgIHRpZmY6SW1hZ2VIZWlnaHQ9IjI2IgogICB0aWZmOk9yaWVudGF0aW9uPSIxIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAg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'
      //icon: './assets/img/bicycle_pin_01.png'
    }).then((marker: Marker) => {
      // Error: sigfoxID == null when remove device !
      this.gcode.Reverse_Geocode_return(location)
        .then((reverse_location) => {
          marker.setTitle(reverse_location);
        });
      marker.on(GoogleMapsEvent.INFO_OPEN).subscribe(() => {
        this.showLocationButton();
      });
      marker.on(GoogleMapsEvent.INFO_CLOSE).subscribe(() => {
        this.hideLocationButton();
      });
      device.ref.child('location').on('value', snapshot => {
        if ( snapshot.exists()) {
          let location = {lat: snapshot.val().lat, lng: snapshot.val().lng};
          marker.setPosition(location);
          this.gcode.Reverse_Geocode_return(location).then(reverse_location => {
            marker.setTitle(reverse_location);
          });
        }
      }, err => console.log(err));
      device.ref.parent.on('child_removed', snapshot => {
        if ( sigfoxID == snapshot.key) marker.remove();
      }, err => console.log(err));
    });
  }
  addCircle(device, radius) {
    let sigfoxID = device.key;
    let location = { lat: device.child('location').child('lat').val(), lng: device.child('location').child('lng').val()}
    this.map.addCircle({
      'center': location,
      'radius': radius,
      'strokeColor': '#f66555',
      'strokeWidth': 0.00000001,
      'visible': false,
      'fillColor': '#f66555'
    }).then(circle => {
      device.ref.child('lock').child('status').on('value', snapshot => {
        if ( snapshot.exists()) circle.setVisible(snapshot.val());
      }, err => console.log(err));
      device.ref.child('location').on('value', snapshot => {
        if ( snapshot.exists()) circle.setCenter({lat: snapshot.val().lat, lng: snapshot.val().lng});
      }, err => console.log(err));
      device.ref.parent.on('child_removed', snapshot => {
        if ( sigfoxID == snapshot.key) circle.remove();
      }, err => console.log(err));
    });
  }
  setLocation(location) {
    if ( this.platform.is('cordova')) {
      this.map.animateCamera( {
        target: location,
        zoom: 17,
        tilt: 0,
        bearing: 0,
        duration: 1000
      }).then( suc => {
        this.lat = location.lat;
        this.lng = location.lng;
      });
    }
  }
  showLocationButton() {

  }
  hideLocationButton() {

  }
}

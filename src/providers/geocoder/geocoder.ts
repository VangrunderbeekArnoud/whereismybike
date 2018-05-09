import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
declare var google;
/*
  Generated class for the GeocoderProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GeocoderProvider {
  public locationName: any;
  public lat: any;
  public lng: any;
  //public geocoder: any = new google.maps.Geocoder;
  public geocoder: any;

  constructor(public platform: Platform, ){
    // check if google.maps is ready!
    platform.ready().then(() => {
      this.geocoder = new google.maps.Geocoder;
    });
  }
  Geocode(address) {
    this.geocoder.geocode( { 'address': address}, (results, status) => {
      if (status == 'OK') {
       var position = results[0].geometry.location
       this.lat = position.lat();
       this.lng = position.lng();
       //this.pop.locatePosition(this.lat, this.lng)
       console.log(this.lat)
      } else {
       // alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  Reverse_Geocode_return(location): Promise<any> {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({'location': location}, (results, status) => {
        if ( status === 'OK') {
          if ( results[0]) {
            console.log(results[0].formatted_address);
            resolve(results[0].formatted_address);
          }
        }
        resolve(null);
      });
    });
  }
  Reverse_Geocode(lat, lng, map, driverMode){

    let latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    this.geocoder.geocode({'location': latlng}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          if (!driverMode){
          //document.getElementById("location").innerText = results[0].formatted_address;
          this.locationName = results[0].formatted_address;
          }else{
          var driver_location = results[0].formatted_address;
          }

        } else {
         // window.alert('No results found');
        }
      } else {
       // window.alert('Geocoder failed due to: ' + status);
      }
    });

  }
  Simple_Geocode(lat, lng){
    let latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    let result;
    this.geocoder.geocode({'location': latlng}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {

         result = results[0].formatted_address

        }
      }
    });
    return result
  }
}

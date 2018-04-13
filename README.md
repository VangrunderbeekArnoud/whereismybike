Where is my bike
=====================

## Errors

* add-device-page cancel, marker still exists!

## Todo

* when changing pictures, the popupprovider must be shown earlier
* when entering home, the map doesn't cover the whole screen
* at the add device page, when entering device id, popupprovider must be shown
* at devices page, add live battery status icon with css
* change phone auth from dev to prod
* add onesignal popupprovider
* change icon and splash
* change complains into questions
* add rating this product at support page connected to appstore
* add location of devices to maps
* when adding a device, the name popup says 'your name', change it !

## Using this project

To install the project, install the node modules by running

```bash
$ npm install
```

Next, ensure that cordova is installed by running

```bash
$ npm install -g cordova
```

If npm hangs, follow these three steps

```bash
$ npm cache clean --force
$ npm config set registry http://registry.npmjs.org/
$ npm config set loglevel info
```

We are using Android 6.3.0 to ensure cordova firebase plugin does not throw any errors.  
Next add the platforms
```bash
$ ionic cordova platform add android@6.3.0
$ ionic cordova platform add ios
```

Error: Failed to fetch plugin cordova-plugin-paystack@^3.1.0
Error: Failed to fetch plugin cordova-plugin-ionic-webview@^1.1.16  
Error: Failed to fetch plugin cordova-plugin-camera@^3.0.0
rror loading dependencies for applyCustomConfig.js 

## Firebase

Create a Firebase account and create an app.  
Replace the details in [app.module.ts](./src/app/app.module.ts) file, similar to this below with your own
```bash
export const firebaseConfig = {
  apiKey: "**************************", 
  authDomain: "**************************",
  databaseURL: "**************************",
  storageBucket: "**************************",
  messagingSenderId: "**************************"
};
```

## OneSignal

Create an account and an app on [OneSignal](https://onesignal.com).  
Fill in your Google Server API Key and Google Project Number from [Firebase](https://console.firebase.google.com)
project settings.  
Change the AppId and the Google Project Number in [app.component.ts](./src/app/app.component.ts) to your project.
Run the following command to ensure your SDK is on the latest version:
```bash
$ ionic cordova plugin remove onesignal-cordova-plugin
$ ionic cordova plugin add onesignal-cordova-plugin
```

## GoogleMaps

Enable Google Maps API on the [developers](https://console.developers.google.com) page of Google.  
Uninstall the Google Maps plugins:
```bash
$ ionic cordova plugin rm cordova-plugin-googlemaps
$ ionic cordova plugin rm com.googlemaps.ios
```
After that we need to install googlemaps plugin again. BUT, install version 2.1.0 instead of the latest !
With the latest version I wasn't able to get the current location of my device. The type of error I got was:
'cannot read property bind'. Run the following command:
```bash
$ ionic cordova plugin add cordova-plugin-googlemaps@2.1.0 \
--variable API_KEY_FOR_ANDROID="AIzaSyAMJZQkbwaw-vPOmMbcs0mx-2IGk35Ha-s" \
--variable API_KEY_FOR_IOS="AIzaSyDoVrwVoH7iNoqPnvOywwiljO2CMCSfmoo"
```
I was missing a node_module named 'minimist', so I copied this module from my project
node_modules to the './plugin/cordova-plugin-googlemaps/node_modules' folder which solved the error !

## Phone authentication

Go to your Firebase project settings, under your apps you'll find the google-services.json file. Add
this to your project root. ![Firebase google-services.json file](./resources/readme/google-services.png?raw=true "Google-services.json")

## Fixing errors

When running the emulator first, and then going back to running the program on an actual device,
Ionic wasn't able to run it on the device anymore. Also Ionic didn't displayed any errors, so it was
very hard to know what's going on! After running the command below, it worked again.
```bash
$ ionic doctor check
```
If that doesn't fix the problem, run:
```bash
$ npm install
```

## Convert and use images to BASE64

Convert your standard images to BASE64 with this [tool](https://www.base64-image.de/).

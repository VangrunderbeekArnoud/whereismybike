// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
exports.locationListeners = functions.database.ref('users/{pushId}/devices/{sigfoxID}/')
    .onCreate((snapshot, context) => {
    const sigfoxID = snapshot.key;
    console.log('created device with sigfixID = ' + sigfoxID);
    functions.database.ref(`devices/${sigfoxID}/location/gps/lat/`).onUpdate(snap => {
        console.log('lat update: yay');
    });
    return null;
});
//# sourceMappingURL=index.js.map
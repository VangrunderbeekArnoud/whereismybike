"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.locationListeners = functions.database.ref('users/{pushId}/devices/{sigfoxID}/')
    .onCreate(snapshot => {
    const sigfoxID = snapshot.key;
    const status = snapshot.child('lock').child('status').val();
    admin.database().ref(`devices/${sigfoxID}/location/gps/`)
        .on('value', snap => {
        snapshot.ref.child('location').update({
            lat: snap.val().lat,
            lng: snap.val().lng
        }).catch(err => console.log(err));
    }, err => {
        console.log(err);
    });
    return snapshot;
});
exports.locationListenersDelete = functions.database.ref('users/{pushId}/devices/{sigfoxID}/')
    .onDelete(snapshot => {
    //console.log('deleted!!');
    snapshot.ref.off();
    return null;
});
exports.lock = functions.database.ref('users/{pushId}/devices/{sigfoxID}/lock/status/')
    .onWrite(snapshot => {
    const after = snapshot.after;
    const status = after.val();
    const sigfoxID = after.ref.parent.parent.key;
    //console.log('sigfoxID = '+sigfoxID+', status = '+status);
    if (status) { // if the lock status is set true
        admin.database().ref(`devices/${sigfoxID}/location/gps/`)
            .once('value', result => {
            //console.log('lat: '+result.val().lat+ ', lng: '+result.val().lng);
            after.ref.parent.child('location').update({
                lat: result.val().lat,
                lng: result.val().lng
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }
    else {
        //console.log('lat: null, lng: null');
        after.ref.parent.child('location').update({
            lat: null,
            lng: null
        }).catch(err => console.log(err));
    }
    return null;
});
//# sourceMappingURL=index.js.map
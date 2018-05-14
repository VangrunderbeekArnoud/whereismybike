import { Injectable } from '@angular/core';
import  firebase from 'firebase';
import { Platform } from 'ionic-angular';


@Injectable()
export class AuthProvider {
  public fireAuth:firebase.auth.Auth;
  public userProfileRef:firebase.database.Reference;
  private currentUser: firebase.User;
  //public provider = new firebase.auth.FacebookAuthProvider();

  constructor(public platform: Platform) {
     this.userProfileRef = firebase.database().ref('/users');
     firebase.auth().onAuthStateChanged((user: firebase.User) => this.currentUser = user);
  }

  loginUser(email: string, password: string): Promise<any> {
    return  firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
    return  firebase.auth().createUserWithEmailAndPassword(email, password).then( newUser => {
      this.userProfileRef.child(newUser.uid).set({
        email: email
      });
    });
  }

  resetPassword(email: string): Promise<void> {
    return  firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    this.userProfileRef.child( firebase.auth().currentUser.uid).off();
    return  firebase.auth().signOut();
  }
  deleteUser(password: string): Promise<void> {
    return firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, password)).then(() => {
      firebase.auth().currentUser.delete();
    });
  }
  get authenticated(): boolean {
    return this.currentUser !== null;
  }
  signOut(): void {
    firebase.auth().signOut();
  }
  displayName(): string {
    if (this.currentUser !== null) {
      return this.currentUser.displayName;
    } else {
      return '';
    }
  }

  }


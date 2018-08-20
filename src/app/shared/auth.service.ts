import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users;

  constructor(public afAuth: AngularFireAuth, private _route: Router) {
    console.log('auth constructor');
    afAuth.user.subscribe(
      res => {
        if (res) {
          console.log('auth state', res.uid);
          this.users = res;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  loginWithFacebook() {
    return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }

  loginWithGoogle() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      localStorage.clear();
      this._route.navigate(['']);
    });
  }
}

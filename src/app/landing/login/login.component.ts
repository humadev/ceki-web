import { AuthService } from './../../shared/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ceki-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private auth: AuthService, private _route: Router) {
    this.auth.afAuth.authState.subscribe(res => {
      if (this.auth.users) {
        this._route.navigate(['console']);
      }
    });
  }

  async facebook() {
    const login = await this.auth.loginWithFacebook();
    if (login) {
      this._route.navigate(['console']);
    }
  }

  async google() {
    const login = await this.auth.loginWithGoogle();
    if (login) {
      this._route.navigate(['console']);
    }
  }
}

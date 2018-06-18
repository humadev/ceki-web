import { AuthService } from './../../shared/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'ceki-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private auth: AuthService) {}

  facebook() {
    this.auth.loginWithFacebook();
  }

  google() {
    this.auth.loginWithGoogle();
  }
}

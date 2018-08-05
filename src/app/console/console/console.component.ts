import { Component } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'ceki-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent {
  name;
  photo;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService
  ) {
    this.auth.afAuth.authState.subscribe(res => {
      if (this.auth.afAuth.auth.currentUser) {
        this.name = this.auth.afAuth.auth.currentUser.displayName;
        this.photo = this.auth.afAuth.auth.currentUser.photoURL;
      }
    });
  }

  logout(e) {
    this.auth.logout();
  }
}

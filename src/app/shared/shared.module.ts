import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './auth.service';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../environments/environment';

@NgModule({
    imports: [CommonModule, AngularFireAuthModule, AngularFireModule.initializeApp(environment.firebase)],
  declarations: [],
  providers: [AuthService]
})
export class SharedModule {}

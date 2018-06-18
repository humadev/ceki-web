import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './auth.service';

@NgModule({
  imports: [CommonModule, AngularFireAuthModule],
  declarations: [],
  providers: [AuthService]
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './auth.service';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../environments/environment';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatTabsModule,
  MatCardModule,
  MatDialogModule,
  MatProgressBarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule,
    MatProgressBarModule
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule,
    AngularFireModule,
    AngularFireAuthModule,
    MatProgressBarModule
  ],
  declarations: [],
  providers: [AuthService]
})
export class SharedModule {}

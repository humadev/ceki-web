import { GameEngineService } from './game-engine.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

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
import { WebrtcService } from './webrtc.service';

@NgModule({
  imports: [
    CommonModule,
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
    MatProgressBarModule
  ]
})
export class SharedModule {}

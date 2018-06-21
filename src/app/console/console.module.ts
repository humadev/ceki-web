import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsoleRoutingModule } from './console-routing.module';
import { ConsoleComponent } from './console/console.component';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatTabsModule
} from '@angular/material';
import { ProfileComponent } from './profile/profile.component';
import { PlayRoomComponent } from './play-room/play-room.component';
import { HistoryComponent } from './history/history.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ConsoleRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    FormsModule
  ],
  declarations: [
    ConsoleComponent,
    ProfileComponent,
    PlayRoomComponent,
    HistoryComponent
  ]
})
export class ConsoleModule {}

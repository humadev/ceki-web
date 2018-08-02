import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsoleRoutingModule } from './console-routing.module';
import { ConsoleComponent } from './console/console.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ProfileComponent } from './profile/profile.component';
import { PlayRoomComponent } from './play-room/play-room.component';
import { HistoryComponent } from './history/history.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ConsoleRoutingModule,
    LayoutModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    ConsoleComponent,
    ProfileComponent,
    PlayRoomComponent,
    HistoryComponent
  ],
  providers: []
})
export class ConsoleModule {}

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
import { RoomComponent } from './room/room.component';
import { JoinRoomComponent } from './join-room/join-room.component';

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
    HistoryComponent,
    RoomComponent,
    JoinRoomComponent
  ],
  providers: [],
  entryComponents: [RoomComponent, JoinRoomComponent]
})
export class ConsoleModule {}

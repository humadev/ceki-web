import { HistoryComponent } from './history/history.component';
import { PlayRoomComponent } from './play-room/play-room.component';
import { ProfileComponent } from './profile/profile.component';
import { ConsoleComponent } from './console/console.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ConsoleComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'play',
        component: PlayRoomComponent
      },
      {
        path: 'history',
        component: HistoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsoleRoutingModule {}

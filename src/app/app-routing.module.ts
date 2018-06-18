import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './landing/landing.module#LandingModule'
  },
  {
    path: 'console',
    loadChildren: './console/console.module#ConsoleModule'
  },
  {
    path: 'game',
    loadChildren: './game/game.module#GameModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

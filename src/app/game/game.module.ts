import { GameRoutingModule } from './game-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TableComponent } from './table/table.component';
import { CardComponent } from './card/card.component';
import { MainPlayerComponent } from './main-player/main-player.component';
import { ShadowPlayerComponent } from './shadow-player/shadow-player.component';
import { DealerCardComponent } from './dealer-card/dealer-card.component';
import { TrashCardComponent } from './trash-card/trash-card.component';
import { NgDragDropModule } from 'ng-drag-drop';

@NgModule({
  imports: [
    CommonModule,
    GameRoutingModule,
    FlexLayoutModule,
    NgDragDropModule.forRoot()
  ],
  declarations: [
    TableComponent,
    CardComponent,
    MainPlayerComponent,
    ShadowPlayerComponent,
    DealerCardComponent,
    TrashCardComponent
  ]
})
export class GameModule {}

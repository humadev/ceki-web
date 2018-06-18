import { GameEngineService } from './../game-engine.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ceki-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  constructor(private _engine: GameEngineService) {}

  onCardDropInMain(e) {
    this._engine.playersManifest[0].cards.push(e.dragData.value);
    this._engine.dealersCards.splice(e.dragData.index, 1);
  }

  onCardEnterMain(e) {
    console.log(e);
  }

  onCardLeaveMain(e) {
    console.log(e);
  }

  onCardDropInTrash(e) {
    this._engine.playersManifest[0].trash.push(e.dragData.value);
    this._engine.playersManifest[0].cards.splice(e.dragData.index, 1);
  }
}

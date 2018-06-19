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
    this._engine.dropInMain(e);
  }

  onCardEnterMain(e) {
    console.log(e);
  }

  onCardLeaveMain(e) {
    console.log(e);
  }

  onCardDropInTrash(e) {
    this._engine.dropInTrash(e);
  }
}

import { GameEngineService } from './../game-engine.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ceki-main-player',
  templateUrl: './main-player.component.html',
  styleUrls: ['./main-player.component.scss']
})
export class MainPlayerComponent {
  @Input() cards = [];

  constructor(private _engine: GameEngineService) {
    this.cards = _engine.playersManifest[0].cards;
  }

  removeCard(e, i) {
    console.log(i);
    this._engine.playersManifest[0].cards.splice(i, 1);
  }
}

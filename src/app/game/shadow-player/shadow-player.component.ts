import { GameEngineService } from './../../shared/game-engine.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ceki-shadow-player',
  templateUrl: './shadow-player.component.html',
  styleUrls: ['./shadow-player.component.scss']
})
export class ShadowPlayerComponent implements OnInit {
  class;
  @Input()
  landscape = false;
  set;
  @Input()
  align = 'center';
  @Input()
  cards = [];
  @Input()
  player: number;

  constructor(private _engine: GameEngineService) {
    // this.cards = this._engine.playersManifest[this.player].cards;
    this._engine.gamePlay.subscribe(res => {
      this.cards = this._engine.playersManifest[this._engine.playerIndex].cards;
    });
  }

  ngOnInit() {
    if (this.landscape) {
      this.class = ['landscape', 'shadow', 'closed'];
      this.set = 'column';
    } else {
      this.set = 'row';
      this.class = ['portrait', 'shadow', 'closed'];
    }
  }
}

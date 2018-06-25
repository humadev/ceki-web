import { Component, OnInit, Input } from '@angular/core';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'ceki-dealer-card',
  templateUrl: './dealer-card.component.html',
  styleUrls: ['./dealer-card.component.scss']
})
export class DealerCardComponent {
  @Input() cards = [];

  constructor(private _engine: GameEngineService) {
    this.cards = _engine.dealersCards;
    this._engine.gamePlay.subscribe(res => {
      this.cards = _engine.dealersCards;
    });
  }

  removeCard(e, i) {
    this.cards.pop();
    this._engine.dealersCards.pop();
  }
}

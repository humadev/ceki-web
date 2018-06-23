import { GameEngineService } from './../game-engine.service';
import { Component, OnInit, Input } from '@angular/core';
import { WebsocketService } from '../../shared/websocket.service';

@Component({
  selector: 'ceki-main-player',
  templateUrl: './main-player.component.html',
  styleUrls: ['./main-player.component.scss']
})
export class MainPlayerComponent {
  @Input() cards = [];

  constructor(
    private _engine: GameEngineService,
    private _ws: WebsocketService
  ) {
    this.cards = _engine.playersManifest[this._engine.playerIndex].cards;
    this._engine.gamePlay.subscribe(res => {
      this.cards = res[this._engine.playerIndex].cards;
    });
  }

  dropInOrder(e, c, i) {
    const order = [];
    if (e.dragData.index !== i) {
      this.cards.forEach((card, index) => {
        if (e.dragData.index !== index) {
          if (i === index) {
            order.push(e.dragData.value);
          }
          order.push(card);
        }
      });
      this.cards = order;
      this._engine.playersManifest[this._engine.playerIndex].cards = order;
      this._ws.socket.emit('send room', this._engine.playersManifest);
    }
  }
}

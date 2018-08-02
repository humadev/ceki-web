import { GameEngineService } from './../game-engine.service';
import { Component, Input, OnInit } from '@angular/core';
import { WebsocketService } from '../../shared/websocket.service';
import {
  timer,
  interval,
  Observable,
  merge
} from '../../../../node_modules/rxjs';
import {
  map,
  switchMap,
  filter,
  takeUntil
} from '../../../../node_modules/rxjs/operators';

@Component({
  selector: 'ceki-main-player',
  templateUrl: './main-player.component.html',
  styleUrls: ['./main-player.component.scss']
})
export class MainPlayerComponent implements OnInit {
  @Input() cards = [];
  turnTime = 0;
  startTimer: Observable<any>;
  myTurn = false;

  constructor(
    private _engine: GameEngineService,
    private _ws: WebsocketService
  ) {
    this.cards = _engine.playersManifest[this._engine.playerIndex].cards;
    this._engine.gamePlay.subscribe(res => {
      this.cards = res[this._engine.playerIndex].cards;
    });
    const time = merge(
      timer(30000).pipe(
        map(res => {
          this.myTurn = false;
          this.turnTime = 0;
          this._engine.autoMove.next(true);
        })
      ),
      this._engine.myTurn.pipe(
        filter(val => val === false),
        map(res => {
          this.myTurn = false;
          this.turnTime = 0;
        })
      )
    );
    this.startTimer = interval(10).pipe(
      map(x => x + 1), // to start from 1 instead of 0
      map(x => {
        this.turnTime = (x / 3000) * 100;
      }), // do some logic here
      takeUntil(time)
    );

    this._engine.myTurn
      .pipe(
        filter(val => val === true),
        map(res => {
          this.myTurn = true;
        }),
        switchMap(res => this.startTimer)
      )
      .subscribe(
        res => {},
        err => {},
        () => {
          this.myTurn = false;
          this.turnTime = 0;
          this._engine.autoMove.next(true);
        }
      );
  }

  ngOnInit() {
    if (this._engine.turn) {
      this._engine.myTurn.next(true);
    }
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

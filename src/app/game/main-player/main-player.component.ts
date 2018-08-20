import { GameEngineService } from './../../shared/game-engine.service';
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
  @Input()
  cards = [];
  turnTime = 0;
  startTimer: Observable<any>;
  myTurn = false;
  message;
  soca = 0;
  serigat = 0;
  lawang = 0;
  benchmark: boolean;
  win = false;
  lose = false;

  constructor(
    private _engine: GameEngineService,
    private _ws: WebsocketService
  ) {
    // this.cards = this._engine.playersManifest[this._engine.playerIndex].cards;
  }

  ngOnInit() {
    this._engine.win.subscribe(res => {
      this.win = res;
    });
    this._engine.lose.subscribe(res => {
      this.lose = res;
    });
    this._engine.gamePlay.subscribe(res => {
      if (res && res.length > 0) {
        this.cards = res[this._engine.playerIndex].cards;
        this.soca = this._engine.soca.length;
        this.serigat = this._engine.serigat.length;
        this.lawang = this._engine.lawang.length;
      }
    });
    this._engine.benchmark.subscribe(b => {
      this.benchmark = b;
    });
    this._engine.status.subscribe(status => {
      this.soca = this._engine.soca.length;
      this.serigat = this._engine.serigat.length;
      this.lawang = this._engine.lawang.length;
    });

    const time = merge(
      timer(60000).pipe(
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
        this.turnTime = (x / 6000) * 100;
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

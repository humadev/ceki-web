import { Subject, of } from 'rxjs';
import { WebsocketService } from './../shared/websocket.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  players = 5;

  playingCards = [];
  playersManifest = [
    {
      name: 'Player 1',
      cards: [],
      trash: []
    },
    {
      name: 'Player 2',
      cards: [],
      trash: []
    },
    {
      name: 'Player 3',
      cards: [],
      trash: []
    },
    {
      name: 'Player 4',
      cards: [],
      trash: []
    },
    {
      name: 'Player 5',
      cards: [],
      trash: []
    }
  ];

  gamePlay = new Subject();
  gameLogs = new Subject();
  autoMove = new Subject();
  myTurn: Subject<boolean> = new Subject();

  dealersCards = [];
  ws;
  roomID;
  initiator = false;
  messages: Subject<any>;
  playerIndex = 0;
  turn = false;
  pick = 0;
  throw = 0;
  init = false;

  constructor(private _ws: WebsocketService, private router: Router) {
    this._ws.socket.on('rejoin room', data => {
      this.gameLogs.next(
        `mulai kembali permainan sebagai pemain ${this.playerIndex + 1}`
      );
      this.playersManifest = data.gameState.players;
      this.dealersCards = data.gameState.dealers;
      this.turn = data.gameState.players[this.playerIndex].turn;
      this.pick = data.gameState.players[this.playerIndex].pick;
      this.throw = data.gameState.players[this.playerIndex].throw;
      if (this.turn) {
        this.gameLogs.next(`pemain mendapatkan giliran`);
        this.myTurn.next(true);
      }
      this.gamePlay.next(this.playersManifest);
    });

    if (this.init === false) {
      const gameState = JSON.parse(localStorage.getItem('gs'));
      if (gameState) {
        this.roomID = gameState.rid;
        this.init = true;
        this.playerIndex = gameState.pi;
        this._ws.socket.emit('rejoin room', { roomID: this.roomID });
      }
    }

    this._ws.socket.on('play', data => {
      this.playersManifest = data.players;
      this.dealersCards = data.dealers;
      this.gamePlay.next(this.playersManifest);
      this.init = true;
      localStorage.setItem(
        'gs',
        JSON.stringify({
          rid: this.roomID,
          i: this.initiator,
          pi: this.playerIndex
        })
      );
      this.router.navigate(['game']);
      this.gameLogs.next(
        `mulai permainan sebagai pemain ${this.playerIndex + 1}`
      );
    });

    this._ws.socket.on('move', data => {
      const timeNow = new Date();
      this.gameLogs.next(
        'Round trip time from websocket ' +
          (timeNow.getTime() - data.date + ' ms')
      );
      this.playersManifest[data.index].cards = data.card;
      this.playersManifest[data.index].trash = data.trash;
      this.dealersCards = data.dealers;
      this.gamePlay.next(this.playersManifest);
      if (data.turning && this.itsMyIndex(data.index)) {
        this.gameLogs.next(`pemain mendapatkan giliran`);
        this.turn = true;
        this.pick = 1;
        this.throw = 1;
        this.myTurn.next(true);
      }
    });

    this.gamePlay.next(this.playersManifest);

    this.autoMove.subscribe(res => {
      this.autoMoveCard();
    });
  }

  play() {
    this.turn = true;
    this.pick = 1;
    this.throw = 1;
    this._ws.socket.emit('init play', { roomID: this.roomID });
  }

  dropInMain(e) {
    if (this.pick === 1) {
      this.playersManifest[this.playerIndex].cards.push(e.dragData.value);
      this.dealersCards.splice(e.dragData.index, 1);
      this.pick = 0;
      if (this.pick === 0 && this.throw === 0) {
        this.turn = false;
        this.myTurn.next(false);
      }
      const dateMove = new Date();
      this.gameLogs.next(`emit ke channel 'move' saat kartu pindah ke pemain`);
      this._ws.socket.emit('move', {
        card: this.playersManifest[this.playerIndex].cards,
        trash: this.playersManifest[this.playerIndex].trash,
        index: this.playerIndex,
        roomID: this.roomID,
        dealers: this.dealersCards,
        turning: !this.turn,
        pick: this.pick,
        throw: this.throw,
        date: dateMove.getTime()
      });
    }
  }

  dropInTrash(e) {
    if (this.throw === 1) {
      this.throw = 0;
      if (this.pick === 0 && this.throw === 0) {
        this.turn = false;
        this.myTurn.next(false);
      }
      this.playersManifest[this.playerIndex].trash.push(e.dragData.value);
      this.playersManifest[this.playerIndex].cards.splice(e.dragData.index, 1);
      const dateMove = new Date();
      this.gameLogs.next(
        `emit ke channel 'move' saat kartu pindah ke pembuangan`
      );
      this._ws.socket.emit('move', {
        card: this.playersManifest[this.playerIndex].cards,
        trash: this.playersManifest[this.playerIndex].trash,
        index: this.playerIndex,
        roomID: this.roomID,
        dealers: this.dealersCards,
        turning: !this.turn,
        pick: this.pick,
        throw: this.throw,
        date: dateMove.getTime()
      });
    }
  }

  itsMyIndex(index) {
    let obsIndex = index + 1;
    if (obsIndex > 4) {
      obsIndex -= 5;
    }
    if (obsIndex === this.playerIndex) {
      return true;
    } else {
      return false;
    }
  }

  autoMoveCard() {
    console.log('automove');
    const cardToMain = this.dealersCards[0];
    const cardToTrash = this.playersManifest[this.playerIndex].cards[
      this.playersManifest[this.playerIndex].cards.length - 1
    ];

    // drop to trash
    this.throw = 0;
    this.playersManifest[this.playerIndex].trash.push(cardToTrash);
    this.playersManifest[this.playerIndex].cards.splice(
      this.playersManifest[this.playerIndex].cards.length - 1,
      1
    );

    this.gameLogs.next(`auto emit ke channel 'move' saat waktu habis`);

    // drop to main
    this.playersManifest[this.playerIndex].cards.push(cardToMain);
    this.dealersCards.splice(0, 1);
    this.pick = 0;
    this.turn = false;
    const dateMove = new Date();
    this._ws.socket.emit('move', {
      card: this.playersManifest[this.playerIndex].cards,
      trash: this.playersManifest[this.playerIndex].trash,
      index: this.playerIndex,
      roomID: this.roomID,
      dealers: this.dealersCards,
      turning: true,
      pick: this.pick,
      throw: this.throw,
      date: dateMove.getTime()
    });
  }
}

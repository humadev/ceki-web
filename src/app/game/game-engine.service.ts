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
      this.playersManifest = data.gameState.players;
      this.dealersCards = data.gameState.dealers;
      this.turn = data.gameState.players[this.playerIndex].turn;
      this.pick = data.gameState.players[this.playerIndex].pick;
      this.throw = data.gameState.players[this.playerIndex].throw;
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
    });

    this._ws.socket.on('move', data => {
      this.playersManifest[data.index].cards = data.card;
      this.playersManifest[data.index].trash = data.trash;
      this.dealersCards = data.dealers;
      this.gamePlay.next(this.playersManifest);
      console.log(this.itsMyIndex(data.index));
      if (data.turning && this.itsMyIndex(data.index)) {
        this.turn = true;
        this.pick = 1;
        this.throw = 1;
        alert('giliranmu!');
      }
    });

    this.gamePlay.next(this.playersManifest);
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
      }
      this._ws.socket.emit('move', {
        card: this.playersManifest[this.playerIndex].cards,
        trash: this.playersManifest[this.playerIndex].trash,
        index: this.playerIndex,
        roomID: this.roomID,
        dealers: this.dealersCards,
        turning: !this.turn,
        pick: this.pick,
        throw: this.throw
      });
    }
  }

  dropInTrash(e) {
    if (this.throw === 1) {
      this.throw = 0;
      if (this.pick === 0 && this.throw === 0) {
        this.turn = false;
      }
      this.playersManifest[this.playerIndex].trash.push(e.dragData.value);
      this.playersManifest[this.playerIndex].cards.splice(e.dragData.index, 1);
      this._ws.socket.emit('move', {
        card: this.playersManifest[this.playerIndex].cards,
        trash: this.playersManifest[this.playerIndex].trash,
        index: this.playerIndex,
        roomID: this.roomID,
        dealers: this.dealersCards,
        turning: !this.turn,
        pick: this.pick,
        throw: this.throw
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
}

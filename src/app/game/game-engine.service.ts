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

  constructor(private _ws: WebsocketService, private router: Router) {
    this._ws.socket.on('play', data => {
      this.playersManifest = data.players;
      this.dealersCards = data.dealers;
      this.gamePlay.next(this.playersManifest);
      this.router.navigate(['game']);
    });

    this._ws.socket.on('move', data => {
      this.playersManifest[data.index].cards = data.card;
      this.playersManifest[data.index].trash = data.trash;
      this.dealersCards = data.dealers;
      this.gamePlay.next(this.playersManifest);
    });

    this.gamePlay.next(this.playersManifest);
  }

  play() {
    this._ws.socket.emit('init play', { roomID: this.roomID });
  }

  dropInMain(e) {
    if (this.playersManifest[this.playerIndex].cards.length < 12) {
      this.playersManifest[this.playerIndex].cards.push(e.dragData.value);
      this.dealersCards.splice(e.dragData.index, 1);
      this._ws.socket.emit('move', {
        card: this.playersManifest[this.playerIndex].cards,
        trash: this.playersManifest[this.playerIndex].trash,
        index: this.playerIndex,
        roomID: this.roomID,
        dealers: this.dealersCards
      });
    }
  }

  dropInTrash(e) {
    if (this.playersManifest[this.playerIndex].cards.length > 10) {
      this.playersManifest[this.playerIndex].trash.push(e.dragData.value);
      this.playersManifest[this.playerIndex].cards.splice(e.dragData.index, 1);
      this._ws.socket.emit('move', {
        card: this.playersManifest[this.playerIndex].cards,
        trash: this.playersManifest[this.playerIndex].trash,
        index: this.playerIndex,
        roomID: this.roomID,
        dealers: this.dealersCards
      });
    }
  }
}

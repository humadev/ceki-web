import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebrtcService } from './webrtc.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class GameEngineService {
  players: number;

  playingCards = [];
  playersManifest = [];

  gamePlay = new Subject();
  gameLogs = new Subject();
  autoMove = new Subject();
  myTurn: Subject<boolean> = new Subject();
  playersID = [];

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

  constructor(
    private _rtc: WebrtcService,
    private _ws: WebsocketService,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService
  ) {
    this._ws.socket.on('rejoin room', data => {
      this.gameLogs.next(
        `mulai kembali permainan sebagai pemain ${this.playerIndex + 1}`
      );
      this.playersManifest = data.gameState.players;
      this.dealersCards = data.gameState.dealers;
      this.gamePlay.next(data.gameState.players);
      this._rtc.$init.subscribe(res => {
        this.playersManifest.forEach((player: any) => {
          if (player.uid !== this.auth.users.uid) {
            console.log('trying connecting to peer: ', player.uid);
            this._rtc.connecting(player.uid);
          }
        });
      });
      this.turn = data.gameState.players[this.playerIndex].turn;
      this.pick = data.gameState.players[this.playerIndex].pick;
      this.throw = data.gameState.players[this.playerIndex].throw;
      if (this.turn) {
        this.gameLogs.next(`pemain mendapatkan giliran`);
        this.myTurn.next(true);
      }
    });

    if (this.init === false) {
      const gameState = JSON.parse(localStorage.getItem('gs'));
      if (gameState) {
        this.roomID = gameState.rid;
        this.init = true;
        this.players = gameState.p;
        this.playerIndex = gameState.pi;
        this._ws.socket.emit('rejoin room', { roomID: this.roomID });
      }
    }

    this._ws.socket.on('play', data => {
      data.players.forEach(player => {
        if (player.uid !== this.auth.users.uid) {
          console.log('trying connecting to peer: ', player.uid);
          this._rtc.connecting(player.uid);
        }
      });
      this.players = data.players.length;
      this.playersManifest = data.players;
      this.dealersCards = data.dealers;
      this.gamePlay.next(this.playersManifest);
      this.init = true;
      localStorage.setItem(
        'gs',
        JSON.stringify({
          rid: this.roomID,
          p: this.players,
          i: this.initiator,
          pi: this.playerIndex
        })
      );
      this.router.navigate(['game']);
      this.gameLogs.next(
        `mulai permainan sebagai pemain ${this.playerIndex + 1}`
      );
    });

    this._rtc.$message.subscribe((data: any) => {
      const timeNow = new Date();
      this.gameLogs.next(
        'Round trip time from webrtc ' + (timeNow.getTime() - data.date + ' ms')
      );
      console.log(
        'received from rtc connection in ' +
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
      this.gameLogs.next(
        `broadcast koneksi webrtc saat kartu pindah ke pemain`
      );
      const moveData = {
        card: this.playersManifest[this.playerIndex].cards,
        trash: this.playersManifest[this.playerIndex].trash,
        index: this.playerIndex,
        roomID: this.roomID,
        dealers: this.dealersCards,
        turning: !this.turn,
        turnIndex: this.whosTurn(this.playerIndex),
        pick: this.pick,
        throw: this.throw,
        date: dateMove.getTime()
      };
      this._rtc.sendAll(moveData);
      this.http
          .post(`http://${environment.endpoint}:environment.port/record`, moveData)
        .subscribe(res => console.log('record in server'));
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
        `broadcast koneksi webrtc saat kartu pindah ke pembuangan`
      );
      const moveData = {
        card: this.playersManifest[this.playerIndex].cards,
        trash: this.playersManifest[this.playerIndex].trash,
        index: this.playerIndex,
        roomID: this.roomID,
        dealers: this.dealersCards,
        turning: !this.turn,
        turnIndex: this.whosTurn(this.playerIndex),
        pick: this.pick,
        throw: this.throw,
        date: dateMove.getTime()
      };
      this._rtc.sendAll(moveData);
      this.http
        .post('http://188.166.250.103:3000/record', moveData)
        .subscribe(res => console.log('record in server'));
    }
  }

  itsMyIndex(index) {
    let obsIndex = index + 1;
    if (obsIndex > this.players - 1) {
      obsIndex -= this.players;
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

    this.gameLogs.next(`broadcast koneksi webrtc saat waktu habis`);

    // drop to main
    this.playersManifest[this.playerIndex].cards.push(cardToMain);
    this.dealersCards.splice(0, 1);
    this.pick = 0;
    this.turn = false;
    const dateMove = new Date();
    const moveData = {
      card: this.playersManifest[this.playerIndex].cards,
      trash: this.playersManifest[this.playerIndex].trash,
      index: this.playerIndex,
      roomID: this.roomID,
      dealers: this.dealersCards,
      turning: !this.turn,
      turnIndex: this.whosTurn(this.playerIndex),
      pick: this.pick,
      throw: this.throw,
      date: dateMove.getTime()
    };
    this._rtc.sendAll(moveData);
    this.http
      .post('http://188.166.250.103:3000/record', moveData)
      .subscribe(res => console.log('record in server'));
  }

  whosTurn(index) {
    let obsIndex = index + 1;
    if (obsIndex > this.players - 1) {
      obsIndex -= this.players;
    }
    return obsIndex;
  }
}

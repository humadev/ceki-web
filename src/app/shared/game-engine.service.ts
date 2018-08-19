import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from './../../environments/environment';
import { Subject, BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebrtcService } from './webrtc.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import {
  each,
  groupBy,
  partition,
  flattenDeep,
  chunk,
  concat
} from 'lodash-es';

@Injectable()
export class GameEngineService {
  players: number;

  playingCards = [];
  playersManifest = [];

  benchmark = new BehaviorSubject(true);

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
  playerIndex;
  turn = false;
  pick = 0;
  throw = 0;
  init = false;
  soca = [];
  lawang = [];
  serigat = [];
  status = new BehaviorSubject('');

  constructor(
    private _rtc: WebrtcService,
    private _ws: WebsocketService,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private afAuth: AngularFireAuth
  ) {
    this._ws.socket.on('rejoin room', data => {
      this.gameLogs.next(
        `mulai kembali permainan sebagai pemain ${this.playerIndex + 1}`
      );
      this.playersManifest = data.gameState.players;
      this.dealersCards = data.gameState.dealers;
      this.gamePlay.next(data.gameState.players);
      if (typeof this._rtc.ID !== 'undefined' && this._rtc.ID !== data.peer) {
        console.log('balas koneksi', this._rtc.ID, data.peer);
        this._rtc.connecting(data.peer);
      }
      this.playersManifest.forEach((player: any) => {
        if (player.uid !== this.auth.users.uid) {
          console.log(player.uid, this.auth.users.uid);
          console.log('trying connecting to peer: ', player.uid);
          this._rtc.connecting(player.uid);
        }
      });
      this.turn = data.gameState.players[this.playerIndex].turn;
      this.pick = data.gameState.players[this.playerIndex].pick;
      this.throw = data.gameState.players[this.playerIndex].throw;
      this.soca = data.gameState.players[this.playerIndex].soca;
      this.serigat = data.gameState.players[this.playerIndex].serigat;
      this.lawang = data.gameState.players[this.playerIndex].lawang;
      this.status.next(data.gameState.players[this.playerIndex].status);
      if (this.turn) {
        this.gameLogs.next(`pemain mendapatkan giliran`);
        this.myTurn.next(true);
      }
    });

    afAuth.user.subscribe(user => {
      if (this.init === false) {
        const gameState = JSON.parse(localStorage.getItem('gs'));
        if (gameState) {
          this.roomID = gameState.rid;
          this.init = true;
          this.players = gameState.p;
          this.playerIndex = gameState.pi;
          this._ws.socket.emit('rejoin room', {
            roomID: this.roomID,
            peer: user.uid
          });
        }
      }
    });

    this._ws.socket.on('play', data => {
      console.log(data);
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
      if (data.otherTrash) {
        this.playersManifest[data.otherTrash.index].trash.splice(
          data.otherTrash.trash,
          1
        );
      }
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
      if (e.dragData.type === 'dealer') {
        this.dealersCards.splice(e.dragData.index, 1);
      } else {
        this.playersManifest[this.whosBefore()].trash.splice(
          e.dragData.index,
          1
        );
      }
      this.pick = 0;
      if (this.pick === 0 && this.throw === 0) {
        this.turn = false;
        this.myTurn.next(false);
        this.isMecari(this.playersManifest[this.playerIndex].cards);
        this.isNyaga(this.playersManifest[this.playerIndex].cards);
      }
      const dateMove = new Date();
      this.gameLogs.next(
        `broadcast koneksi webrtc saat kartu pindah ke pemain`
      );

      const moveData = {
        card: this.playersManifest[this.playerIndex].cards,
        trash: this.playersManifest[this.playerIndex].trash,
        otherTrash: {
          index: this.whosBefore(),
          trash: e.dragData.index
        },
        index: this.playerIndex,
        roomID: this.roomID,
        dealers: this.dealersCards,
        turning: !this.turn,
        turnIndex: this.whosTurn(this.playerIndex),
        pick: this.pick,
        throw: this.throw,
        date: dateMove.getTime(),
        soca: this.soca,
        serigat: this.serigat,
        lawang: this.lawang,
        status: this.status.value
      };
      this._rtc.sendAll(moveData);
      this.http
        .post(
          `http://${environment.endpoint}:${environment.port}/record`,
          moveData
        )
        .subscribe(
          res => console.log('record in server'),
          err => console.log('error recording')
        );
    }
  }

  dropInTrash(e) {
    if (this.throw === 1) {
      this.throw = 0;
      if (this.pick === 0 && this.throw === 0) {
        this.turn = false;
        this.myTurn.next(false);
        this.isMecari(this.playersManifest[this.playerIndex].cards);
        this.isNyaga(this.playersManifest[this.playerIndex].cards);
      }
      this.playersManifest[this.playerIndex].trash.push(e.dragData.value);
      this.playersManifest[this.playerIndex].cards.splice(e.dragData.index, 1);
      const dateMove = new Date();
      this.gameLogs.next(
        `broadcast koneksi webrtc saat kartu pindah ke pembuangan`
      );
      this.isMecari(this.playersManifest[this.playerIndex].cards);
      this.isNyaga(this.playersManifest[this.playerIndex].cards);
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
        date: dateMove.getTime(),
        soca: this.soca,
        serigat: this.serigat,
        lawang: this.lawang,
        status: this.status.value
      };

      this._rtc.sendAll(moveData);
      this.http
        .post(
          `http://${environment.endpoint}:${environment.port}/record`,
          moveData
        )
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
    const cardToMain = this.dealersCards[this.dealersCards.length - 1];
    const cardToTrash = this.playersManifest[this.playerIndex].cards[
      this.playersManifest[this.playerIndex].cards.length - 1
    ];

    // drop to trash
    if (this.throw === 1) {
      this.throw = 0;
      this.playersManifest[this.playerIndex].trash.push(cardToTrash);
      this.playersManifest[this.playerIndex].cards.splice(
        this.playersManifest[this.playerIndex].cards.length - 1,
        1
      );
    }

    this.gameLogs.next(`broadcast koneksi webrtc saat waktu habis`);

    // drop to main
    if (this.pick === 1) {
      this.playersManifest[this.playerIndex].cards.push(cardToMain);
      this.dealersCards.splice(this.dealersCards.length - 1, 1);
      this.pick = 0;
    }

    this.isMecari(this.playersManifest[this.playerIndex].cards);
    this.isNyaga(this.playersManifest[this.playerIndex].cards);

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
      date: dateMove.getTime(),
      soca: this.soca,
      serigat: this.serigat,
      lawang: this.lawang,
      status: this.status.value
    };
    this._rtc.sendAll(moveData);
    this.http
      .post(
        `http://${environment.endpoint}:${environment.port}/record`,
        moveData
      )
      .subscribe(res => console.log('record in server'));
  }

  whosTurn(index) {
    let obsIndex = index + 1;
    if (obsIndex > this.players - 1) {
      obsIndex -= this.players;
    }
    return obsIndex;
  }

  whosBefore() {
    let obsIndex = this.playerIndex - 1;
    if (obsIndex < 0) {
      obsIndex = this.players - 1;
    }
    return obsIndex;
  }

  isMecari(cards) {
    // kondisi soca 1, serigat 2, lawang 1(menang ketika kartu
    // dari lawang menjadi sauca, mencari 1 kartu yang sama persis dengan lawang
    // , baik dibuka oleh pemain atau lawan, jika dibuka sendiri dinamakan ngandang, jika dibuka lawan ngenen

    const sisaSoca = this.putSoca(cards);
    const sisaSerigat = this.putSerigat(sisaSoca);
    const sisaLawang = this.putLawang(sisaSerigat);
    if (
      this.soca.length === 1 &&
      this.serigat.length === 2 &&
      this.lawang.length === 1
    ) {
      alert('mecari');
      this.status.next('mecari');
    }
    console.log({
      soca: this.soca,
      serigat: this.serigat,
      lawang: this.lawang
    });
  }

  isNyaga(cards) {
    // posisi nyaga, siap menang, kondisi sauca 2, serigat 1, lawang 1 /
    // serigat tp 2 kartu(lawang 1 = menang saat kondisi musuh membuka klan dari lawang disebut ngenen,
    // dan saat membuka sendiri disebut ngandang ketika kartu sama persis, serigat 2 kartu = dan
    // membuka kartu 1 klan menjadi ngenen)
    if (
      (this.soca.length === 3 && this.lawang.length === 1) ||
      (this.soca.length === 2 &&
        this.serigat.length === 1 &&
        this.lawang.length === 1)
    ) {
      alert('nyaga');
      this.status.next('nyaga');
    } else {
      this.status.next('');
    }
  }

  // rule priority soca, serigat, lawang

  putSoca(cards) {
    const groupNo = groupBy(cards, 'no');
    const partSoca = partition(groupNo, n => {
      if (n.length >= 3) {
        return true;
      } else {
        return false;
      }
    });
    let chunkTo3 = [];
    each(partSoca[0], (row, key) => {
      if (row.length > 3) {
        const chunks = chunk(row, 3);
        chunkTo3 = concat(chunkTo3, chunks);
      } else {
        chunkTo3.push(row);
      }
    });
    const finalSoca = [];
    each(chunkTo3, (row, key) => {
      if (row.length === 3) {
        finalSoca.push(row);
      } else {
        partSoca[1].push(row);
      }
    });
    this.soca = finalSoca;
    return flattenDeep(partSoca[1]);
  }

  putSerigat(cards) {
    const groupSoroh = groupBy(cards, 'soroh');
    const partSerigat = partition(groupSoroh, n => {
      if (n.length >= 3) {
        return true;
      } else {
        return false;
      }
    });
    let chunkTo3 = [];
    each(partSerigat[0], (row, key) => {
      if (row.length > 3) {
        const chunks = chunk(row, 3);
        chunkTo3 = concat(chunkTo3, chunks);
      } else {
        chunkTo3.push(row);
      }
    });
    const finalSerigat = [];
    each(chunkTo3, (row, key) => {
      if (row.length === 3) {
        finalSerigat.push(row);
      } else {
        partSerigat[1].push(row);
      }
    });
    this.serigat = finalSerigat;
    return flattenDeep(partSerigat[1]);
  }

  putLawang(cards) {
    const groupLawang = groupBy(cards, 'no');
    const partLawang = partition(groupLawang, n => {
      if (n.length >= 2) {
        return true;
      } else {
        return false;
      }
    });
    this.lawang = partLawang[0];
    return flattenDeep(partLawang[1]);
  }
}

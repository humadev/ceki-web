import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../../game/game-engine.service';
import { WebsocketService } from '../../shared/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { WebrtcService } from '../../shared/webrtc.service';

@Component({
  selector: 'ceki-play-room',
  templateUrl: './play-room.component.html',
  styleUrls: ['./play-room.component.scss']
})
export class PlayRoomComponent implements OnInit {
  roomID: any;
  room;
  players = [];

  constructor(
    private _engine: GameEngineService,
    private _ws: WebsocketService,
    private _rtc: WebrtcService,
    private _router: ActivatedRoute,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this._auth.afAuth.authState.subscribe(res => {
      if (this._auth.afAuth.auth.currentUser) {
        this._rtc.open(this._auth.users.uid);
      }
    });
  }

  createRoom() {
    const player = {
      uid: this._auth.users.uid,
      name: this._auth.users.displayName,
      email: this._auth.users.email
    };
    this.players.push(player);
    this._ws.socket.emit('create room', player);
    this._engine.initiator = true;
    this._ws.socket.on('create room', data => {
      this.roomID = data.roomID;
      this._engine.roomID = data.roomID;
    });
    this._ws.socket.on('room', msg => {
      this._rtc.connecting(msg[msg.length - 1].uid);
      this.players = msg;
    });
  }

  joinRoom() {
    this._engine.roomID = this.room;
    this._ws.socket.on('room', data => {
      this._rtc.connecting(data[0].uid);
      this.players = data;
    });
    this._ws.socket.on('join room', data => {
      this._engine.playerIndex = data.index;
    });
    this._ws.socket.emit('join room', {
      roomID: this.room,
      uid: this._auth.users.uid,
      name: this._auth.users.displayName,
      email: this._auth.users.email
    });
  }

  play() {
    this._engine.play();
  }

  countUser() {
    this._ws.socket.emit('send room', { room: this.room, data: 'huma' });
  }

  clearRoom(e) {
    localStorage.removeItem('gs');
  }

  sendRTC(e) {
    this._rtc.sendAll(this.players);
  }
}

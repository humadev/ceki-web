import { Component, OnInit } from '@angular/core';
import { GameEngineService } from 'src/app/shared/game-engine.service';
import { WebsocketService } from 'src/app/shared/websocket.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'ceki-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  players = [];
  roomID: any;

  constructor(
    private _engine: GameEngineService,
    private _ws: WebsocketService,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    const player = {
      uid: this._auth.users.uid,
      name: this._auth.users.displayName,
      email: this._auth.users.email,
      photo: this._auth.users.photoURL
    };
    this.players.push(player);
    this._ws.socket.emit('create room', player);
    this._engine.initiator = true;
    this._ws.socket.on('create room', data => {
      this.roomID = data.roomID;
      this._engine.roomID = data.roomID;
    });
    this._ws.socket.on('room', msg => {
      console.log(msg);
      this.players = msg;
    });
  }

  play() {
    this._engine.playersID = this.players;
    this._engine.play();
  }
}

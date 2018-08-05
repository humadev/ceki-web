import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { GameEngineService } from 'src/app/shared/game-engine.service';
import { WebsocketService } from 'src/app/shared/websocket.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'ceki-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {
  players = [];
  roomID: any;

  constructor(
    private _engine: GameEngineService,
    private _ws: WebsocketService,
    private _auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this._engine.roomID = this.data.roomID;
    this._ws.socket.on('room', data => {
      this.players = data;
    });
    this._ws.socket.on('join room', data => {
      this._engine.playerIndex = data.index;
    });
    this._ws.socket.emit('join room', {
      roomID: this.data.roomID,
      uid: this._auth.users.uid,
      name: this._auth.users.displayName,
      email: this._auth.users.email
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../../game/game-engine.service';
import { WebsocketService } from '../../shared/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

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
    private _router: ActivatedRoute,
    private _auth: AuthService
  ) {
  }

  ngOnInit() {
  }

  createRoom() {
      this.players = [{
          name: this._auth.users.displayName,
          email: this._auth.users.email
      }];
      this._ws.socket.emit('create room', 'test');
      this._ws.socket.on('create room', data => {
          this.roomID = data.roomID;
          console.log(data.roomID);
        this._ws.socket.on(data.roomID, msg => {
            switch (msg.type) {
                case 'join':
                    this.players.push(msg.data);
                    this._ws.socket.emit('update room', {roomID: this.roomID, type: 'players', data: this.players});
                    break;
                default:
                    break;
            }
        })
      });
  }

  joinRoom() {
      this._ws.socket.on(this.room, data => {
          switch (data.type) {
              case 'players':
                  this.players = data.data;
                  break;
              default:
                  break;
          }
      });
      this._ws.socket.emit('join room', { roomID: this.room, name: this._auth.users.displayName, email: this._auth.users.email});
  }

  countUser() {
    this._ws.socket.emit('send room', {room: this.room, data: 'huma'});
  }
}

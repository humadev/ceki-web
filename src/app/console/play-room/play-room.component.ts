import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../../game/game-engine.service';
import { WebsocketService } from '../../shared/websocket.service';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

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
    private _fbUser: AngularFireAuth
  ) {
  }

  ngOnInit() {
      this._fbUser.user.subscribe(res => console.log(res));
  }

  createRoom() {
      this.players.push({name: 'player 1'});
      this._ws.socket.emit('create room', 'test');
      this._ws.socket.on('create room', data => {
          this.roomID = data.roomID;
        this._ws.socket.on(data.roomID, msg => {
            switch (msg.type) {
                case 'join':
                    this.players.push(msg.data);
                    this._ws.socket.emit('update room', {roomID: this.roomID, type: 'players', data: this.players});
                    console.log(this.players);
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
                  console.log(this.players);
                  break;
              default:
                  break;
          }
      });
      this._ws.socket.emit('join room', {roomID: this.room, name: 'huma'});
  }

  countUser() {
    this._ws.socket.emit('send room', {room: this.room, data: 'huma'});
  }
}

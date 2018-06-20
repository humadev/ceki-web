import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../../game/game-engine.service';
import { WebsocketService } from '../../shared/websocket.service';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ceki-play-room',
  templateUrl: './play-room.component.html',
  styleUrls: ['./play-room.component.scss']
})
export class PlayRoomComponent implements OnInit {

  room;

  constructor(
    private _engine: GameEngineService,
    private _ws: WebsocketService,
    private _router: ActivatedRoute
  ) {
    _router.paramMap.subscribe((res:any) => {
      if(res.params.roomID) {
        this.room = res.params.roomID;
      } else {
        this.room = this.createRoom();
        console.log(this.room);
      }
    });
  }

  ngOnInit() {
    this._ws.socket.on(this.room, data => {
      console.log(data);
    });
  }

  createRoom() {
    const id =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
    return id;
  }

  countUser() {
    this._ws.socket.emit('send room', {room: this.room, data: 'huma'});
  }
}

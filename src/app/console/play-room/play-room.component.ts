import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../../game/game-engine.service';
import { WebsocketService } from '../../shared/websocket.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ceki-play-room',
  templateUrl: './play-room.component.html',
  styleUrls: ['./play-room.component.scss']
})
export class PlayRoomComponent implements OnInit {
  constructor(
    private _engine: GameEngineService,
    private _ws: WebsocketService
  ) {}

  ngOnInit() {
    const socket = this._ws.connect().pipe(
      map(
        (response: any): any => {
          console.log(response);
        }
      )
    );
  }

  createRoom() {
    const id =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
    this._engine.connectRoom(id).subscribe(res => {
      this._engine.onMessage();
    });
  }

  countUser() {
    this._engine.ws.send('test');
  }
}

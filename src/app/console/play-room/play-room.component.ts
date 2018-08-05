import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameEngineService } from '../../shared/game-engine.service';
import { WebsocketService } from '../../shared/websocket.service';
import { AuthService } from '../../shared/auth.service';
import {
  MatDialog,
  MatDialogRef
} from '../../../../node_modules/@angular/material';
import { RoomComponent } from '../room/room.component';
import { JoinRoomComponent } from '../join-room/join-room.component';

@Component({
  selector: 'ceki-play-room',
  templateUrl: './play-room.component.html',
  styleUrls: ['./play-room.component.scss']
})
export class PlayRoomComponent implements OnDestroy {
  room;
  $createRoom: MatDialogRef<RoomComponent>;
  $joinRoom: MatDialogRef<JoinRoomComponent>;

  constructor(
    private _engine: GameEngineService,
    private _ws: WebsocketService,
    private _auth: AuthService,
    private _dialog: MatDialog
  ) {
    localStorage.removeItem('gs');
    console.log(
      JSON.stringify({
        players: [
          {
            uid: 'Za09tzfmyqQgkaptwyEoxMKmC8m2',
            name: 'Huma Prathama',
            email: 'huma@undiknas.ac.id',
            cards: [13, 2, 4, 26, 3, 6, 17, 15, 9, 4, 10, 13],
            trash: [],
            turn: true,
            pick: 0,
            throw: 1,
            date: 1533445700794
          },
          {
            uid: 'MqScbqwM4FfEB6XrHmLkhDhj2A82',
            name: 'huma prathama',
            email: 'huma.elektro@gmail.com',
            cards: [22, 16, 14, 30, 8, 5, 7, 20, 25, 2, 16],
            trash: [],
            turn: false,
            pick: 0,
            throw: 0
          }
        ],
        dealers: [
          12,
          17,
          27,
          18,
          10,
          27,
          21,
          23,
          18,
          18,
          18,
          20,
          19,
          27,
          26,
          1,
          3,
          5,
          3,
          20,
          25,
          6,
          25,
          6,
          8,
          15,
          19,
          26,
          28,
          27,
          13,
          7,
          15,
          28,
          21,
          29,
          11,
          1,
          10,
          6,
          4,
          26,
          24,
          15,
          14,
          9,
          13,
          7,
          17,
          9,
          29,
          8,
          22,
          12,
          23,
          23,
          20,
          29,
          24,
          9,
          1,
          2,
          24,
          11,
          21,
          2,
          10,
          16,
          28,
          29,
          22,
          14,
          14,
          3,
          30,
          28,
          5,
          19,
          16,
          8,
          25,
          21,
          24,
          12,
          30,
          22,
          7,
          17,
          1,
          11,
          12,
          5,
          19,
          11,
          30,
          4,
          23
        ],
        playersNumber: 2
      })
    );
  }

  createRoom() {
    this.$createRoom = this._dialog.open(RoomComponent);
  }

  joinRoom() {
    this.$joinRoom = this._dialog.open(JoinRoomComponent, {
      data: {
        roomID: this.room
      }
    });
  }

  ngOnDestroy() {
    if (this.$createRoom) {
      this.$createRoom.close();
    }

    if (this.$joinRoom) {
      this.$joinRoom.close();
    }
  }
}

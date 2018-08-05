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

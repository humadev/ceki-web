import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import {
  MatDialog,
  MatDialogRef
} from '../../../../node_modules/@angular/material';
import { RoomComponent } from '../room/room.component';
import { JoinRoomComponent } from '../join-room/join-room.component';
import { WebrtcService } from 'src/app/shared/webrtc.service';

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
    private _rtc: WebrtcService,
    private _auth: AuthService,
    private _dialog: MatDialog
  ) {
    localStorage.removeItem('gs');
  }

  createRoom() {
    this._rtc.open(this._auth.users.uid);
    this.$createRoom = this._dialog.open(RoomComponent, {
      height: '500px',
      width: '800px'
    });
  }

  joinRoom() {
    this._rtc.open(this._auth.users.uid);
    this.$joinRoom = this._dialog.open(JoinRoomComponent, {
      data: {
        roomID: this.room
      },
      height: '500px',
      width: '800px'
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

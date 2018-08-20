import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  socket;

  constructor() {
      this.socket = io.connect(`ws://${environment.endpoint}:${environment.port}`);
  }
}

import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import * as Peer from 'peerjs';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  peer;
  connections = [];
  temp;
  $message = new Subject();
  $init = new Subject();

  constructor(private auth: AuthService) {
    console.log('webrtc constructor');
  }

  open(id) {
    if (!this.peer) {
      console.log('create peer');
      this.peer = new Peer(id, {
        host: environment.endpoint,
        port: environment.port,
        path: '/webrtc/',
        secure: false
      });
      this.peer.on('connection', conn => this.onConnectionPeer(conn));
      this.peer.on('open', ids => this.onOpenPeer(ids));
      this.peer.on('error', err => this.onErrorPeer(err));
    }
  }

  connecting(id) {
    const connect = this.peer.connect(
      id,
      {
        serialization: 'json'
      }
    );

    this.connections.push(connect);
  }

  private onOpenPeer(id) {
    this.$init.next(true);
    console.log('your peer ID: ', id);
  }

  onConnectionPeer(conn) {
    console.log('you have connection peer from: ', conn.peer);
    conn.open = true;
    conn.on('data', data => this.onDataConnection(data, conn.peer));
    conn.on('close', () => this.onCloseConnection(conn.peer));
    conn.on('error', err => this.onErrorConnection(err));
  }

  onDataConnection(data, peer) {
    console.log('received data from peer: ', peer);
    this.$message.next(data);
  }

  onCloseConnection(peer) {
    console.log('close connection from peer: ', peer);
    delete this.connections[peer];
  }

  sendAll(msg) {
    this.connections.forEach(conn => {
      console.log('send data to peer: ', conn.peer);
      conn.send(msg);
    });
  }

  private onErrorPeer(err) {
    console.log('Error peer ', err);
  }

  private onErrorConnection(err) {
    console.log('Error connection ', err);
  }
}

import { Injectable } from '@angular/core';
import * as Peer from 'peerjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  peer;
  connections = [];
  temp;
  $message = new Subject();

  open(id) {
    this.peer = new Peer(id, {
      host: 'localhost',
      port: 3000,
      path: '/webrtc/',
      secure: false
    });
    this.peer.on('connection', conn => this.onConnectionPeer(conn));
    this.peer.on('open', ids => this.onOpenPeer(ids));
    this.peer.on('error', err => this.onErrorPeer(err));
  }

  connecting(id) {
    const connect = this.peer.connect(
      id,
      {
        label: 'room',
        serialization: 'json',
        metadata: { message: 'hi i want to play with you!' }
      }
    );

    this.connections.push(connect);
  }

  private onOpenPeer(id) {
    console.log('your ID', id);
  }

  onConnectionPeer(conn) {
    console.log('you have connection peer', conn.peer);
    conn.open = true;
    conn.on('data', data => this.onDataConnection(data));
    conn.on('close', () => this.onCloseConnection(conn.peer));
    conn.on('error', err => this.onErrorConnection(err));
  }

  onDataConnection(data) {
    this.$message.next(data);
    console.log('received data ', data);
  }

  onCloseConnection(peer) {
    console.log('close connection from ', peer);
    delete this.connections[peer];
  }

  sendAll(msg) {
    this.connections.forEach(conn => {
      conn.send(msg);
    });
  }

  private onErrorPeer(err) {
    console.log('Error peer', err);
  }

  private onErrorConnection(err) {
    console.log('Error connection ', err);
  }
}

import { environment } from './../../environments/environment';
import { Injectable, NgZone } from '@angular/core';
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
  $init = new Subject();
  ID;

  constructor(private zone: NgZone) {
    console.log('webrtc constructor');
  }

  open(id) {
    if (typeof this.peer === 'undefined') {
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
    const checking = this.connections.filter(obj => {
      return obj.id === id;
    });
    if (checking.length === 0) {
      console.log('open connection with ' + id);
      const connect = this.peer.connect(
        id,
        {
          serialization: 'json'
        }
      );

      this.connections.push({
        id: id,
        client: connect
      });
    }
  }

  private onOpenPeer(id) {
    this.$init.next(true);
    this.ID = id;
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
    this.zone.run(() => {
      this.$message.next(data);
    });
  }

  onCloseConnection(peer) {
    console.log('close connection from peer: ', peer);

    if (this.connections.length > 0) {
      this.connections = this.connections.filter(obj => {
        return obj.id !== peer;
      });
    }
  }

  sendAll(msg) {
    this.connections.forEach(conn => {
      console.log('send data to peer: ', conn.client.peer);
      conn.client.send(msg);
    });
  }

  private onErrorPeer(err) {
    console.log('Error peer ', err);
  }

  private onErrorConnection(err) {
    console.log('Error connection ', err);
  }
}

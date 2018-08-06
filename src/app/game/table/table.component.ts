import { GameEngineService } from './../../shared/game-engine.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ceki-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  playerIndex = 0;
  logs = [];
  benchmark = false;
  players: number;

  constructor(public _engine: GameEngineService) {
    const gameState = JSON.parse(localStorage.getItem('gs'));
    this.players = gameState.p;
  }

  ngOnInit() {
    this.playerIndex = this._engine.playerIndex;
    this._engine.gameLogs.subscribe(res => this.logs.push(res));
  }

  onCardDropInMain(e) {
    this._engine.dropInMain(e);
  }

  onCardEnterMain(e) {
    console.log(e);
  }

  onCardLeaveMain(e) {
    console.log(e);
  }

  onCardDropInTrash(e) {
    this._engine.dropInTrash(e);
  }

  shadowPlayerIndex(turn) {
    let turnIndex = this.playerIndex + turn;
    if (turnIndex > this._engine.players - 1) {
      turnIndex -= this._engine.players;
    }

    return turnIndex;
  }

  isAnyoneHere(position) {
    switch (position) {
      case 'L':
        if (this._engine.players === 5) {
          return true;
        } else {
          return false;
        }
        break;
      case 'R':
        return true;
        break;
      case 'TL':
        if (this._engine.players > 3) {
          return true;
        } else {
          return false;
        }
        break;
      case 'TR':
        if (this._engine.players > 2) {
          return true;
        } else {
          return false;
        }
        break;
      default:
        break;
    }
  }
}

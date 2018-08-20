import { GameEngineService } from './../../shared/game-engine.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener
} from '@angular/core';

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
  ctrl = false;
  win = false;
  lose = false;

  constructor(public _engine: GameEngineService) {
    const gameState = JSON.parse(localStorage.getItem('gs'));
    this.playerIndex = gameState.pi;
    this.players = gameState.p;
  }

  ngOnInit() {
      this._engine.win.subscribe(res => {
          this.win = res;
      });
      this._engine.lose.subscribe(res => {
          this.lose = res;
      });
    this._engine.gameLogs.subscribe(res => this.logs.push(res));
    this._engine.benchmark.subscribe(bench => {
      this.benchmark = bench;
    });
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

  @HostListener('window:keydown', ['$event'])
  onKeydown(e) {
    if (e.key === 'Control') {
      this.ctrl = true;
    }
    if (e.key === 'b' && this.ctrl) {
      this._engine.benchmark.next(!this._engine.benchmark.value);
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(e) {
    if (e.key === 'Control') {
      this.ctrl = false;
    }
  }
}

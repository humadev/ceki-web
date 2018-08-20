import { GameEngineService } from './../../shared/game-engine.service';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TrashOverviewComponent } from '../trash-overview/trash-overview.component';

@Component({
  selector: 'ceki-trash-card',
  templateUrl: './trash-card.component.html',
  styleUrls: ['./trash-card.component.scss']
})
export class TrashCardComponent implements OnInit {
  cards = [];
  @Input()
  player: number;
  class = ['portrait', 'trash', 'open'];
  overview = false;
  rotate = true;
  @Input()
  canDrag = false;
  prevent = false;

  constructor(private _engine: GameEngineService, private _dialog: MatDialog) {
    // this.cards = this._engine.playersManifest[this.player].trash;
  }

  ngOnInit() {
    this._engine.gamePlay.subscribe(res => {
      if (this._engine.playersManifest[this.player]) {
        this.cards = this._engine.playersManifest[this.player].trash;
      }
    });
  }

  ngOnInit() {}

  randomRotate() {
    let num = Math.floor(Math.random() * 90); // this will get a number between 1 and 99;
    num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    return num;
  }

  @HostListener('contextmenu', ['$event'])
  onClick(e) {
    e.preventDefault();
    if (!this.prevent) {
      this.openOverview();
    }
    this.prevent = false;
  }

  @HostListener('dblclick', ['$event'])
  onDblClick() {
    this.prevent = true;
    alert('dblclick');
  }

  openOverview() {
    const dialogRef = this._dialog.open(TrashOverviewComponent, {
      data: { cards: this.cards },
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'trash-overview-panel'
    });
  }
}

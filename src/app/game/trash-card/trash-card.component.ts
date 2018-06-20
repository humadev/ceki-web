import { GameEngineService } from './../game-engine.service';
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
  @Input() player: number;
  class = ['portrait', 'trash', 'open'];
  overview = false;
  rotate = true;

  constructor(private _engine: GameEngineService, private _dialog: MatDialog) {}

  ngOnInit() {
    this.cards = this._engine.playersManifest[this.player].trash;
    this._engine.gamePlay.subscribe(res => {
      this.cards = res[this.player].trash;
    });
  }

  randomRotate() {
    let num = Math.floor(Math.random() * 90); // this will get a number between 1 and 99;
    num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    return num;
  }

  @HostListener('click', ['$event'])
  onClick() {
    const dialogRef = this._dialog.open(TrashOverviewComponent, {
      data: { cards: this.cards },
      panelClass: 'trash-overview-panel'
    });
  }
}

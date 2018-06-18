import { GameEngineService } from './../game-engine.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ceki-trash-card',
  templateUrl: './trash-card.component.html',
  styleUrls: ['./trash-card.component.scss']
})
export class TrashCardComponent implements OnInit {
  cards = [];
  @Input() player: number;

  constructor(private _engine: GameEngineService) {}

  ngOnInit() {
    this.cards = this._engine.playersManifest[this.player].trash;
  }

  randomRotate() {
    let num = Math.floor(Math.random() * 90); // this will get a number between 1 and 99;
    num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    return num;
  }
}

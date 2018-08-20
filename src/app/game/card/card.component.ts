import { GameEngineService } from './../../shared/game-engine.service';
import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'ceki-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input()
  class = ['portrait', 'open', 'main'];
  @Input()
  card: any;
  background: any;
  @Input()
  rotate;
  @Input()
  overview = false;
  @Input()
  index;
  @Input()
  type;
  @Input()
  isDraggable = false;
  @Input()
  dragScope;
  benchmark = false;

  constructor(private _engine: GameEngineService) {}

  ngOnInit() {
    if (this.type === 'main' || this.type === 'trash') {
      this.background = {
        'background-image': `url(/assets/cards/ceki-${this.card.soroh}-${
          this.card.no
        }.png)`
      };
    }
    if (this.rotate) {
      this.background.transform = `rotate(${this.randomRotate()}deg)`;
    }

    this._engine.benchmark.subscribe(b => {
      this.benchmark = b;
    });
  }

  randomRotate() {
    let num = Math.floor(Math.random() * 90); // this will get a number between 1 and 99;
    num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    return num;
  }
}

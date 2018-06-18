import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ceki-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() class = ['portrait', 'open', 'main'];
  @Input() cardNumber: number;
  background: any;
  @Input() rotate;

  constructor() {}

  ngOnInit() {
    if (this.cardNumber) {
      this.background = {
        background: `url(/assets/cards/ceki${this.cardNumber}.png) no-repeat`
      };
    }
    if (this.rotate) {
      this.background.transform = `rotate(${this.rotate}deg)`;
    }
  }
}

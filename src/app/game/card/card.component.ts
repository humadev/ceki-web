import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs';

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
  @Input() overview = false;

  constructor() {}

  ngOnInit() {
    if (this.cardNumber) {
      this.background = {
        'background-image': `url(/assets/cards/ceki${this.cardNumber}.png)`
      };
    }
    if (this.rotate) {
      this.background.transform = `rotate(${this.randomRotate()}deg)`;
    }

    // of(this.overview).subscribe(res => {
    //   if (res) {
    //     this.background.transform = `rotate(0deg)`;
    //   } else if (this.rotate) {
    //     // this.background.transform = `rotate(${this.randomRotate()}deg)`;
    //   }
    // });
  }

  randomRotate() {
    let num = Math.floor(Math.random() * 90); // this will get a number between 1 and 99;
    num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    return num;
  }
}

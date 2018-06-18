import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  cards = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30
  ];

  players = 5;

  playingCards = [];
  playersManifest = [
    {
      name: 'Player 1',
      cards: [],
      trash: []
    },
    {
      name: 'Player 2',
      cards: [],
      trash: []
    },
    {
      name: 'Player 3',
      cards: [],
      trash: []
    },
    {
      name: 'Player 4',
      cards: [],
      trash: []
    },
    {
      name: 'Player 5',
      cards: [],
      trash: []
    }
  ];

  dealersCards = [];

  constructor() {
    this.playingCards = [
      ...this.cards,
      ...this.cards,
      ...this.cards,
      ...this.cards
    ];
    this.playingCards = this.shuffle(this.playingCards);
    let player = 0;
    for (const cards of this.playingCards) {
      if (player < this.players) {
        if (this.playersManifest[player].cards.length < 11) {
          this.playersManifest[player].cards.push(cards);
        } else {
          player++;
          if (this.players !== player) {
            this.playersManifest[player].cards.push(cards);
          } else {
            this.dealersCards.push(cards);
          }
        }
      } else {
        this.dealersCards.push(cards);
      }
    }
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

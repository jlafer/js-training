const suits = [
  { name: 'hearts', symbol: '♥', color: 'red' },
  { name: 'diamonds', symbol: '♦', color: 'red'},
  { name: 'clubs', symbol: '♣', color: 'black'},
  { name: 'spades', symbol: '♠', color: 'black'}
];

const ranks = [
  { name: 'A', value: 1 },
  { name: '2', value: 2 },
  { name: '3', value: 3 },
  { name: '4', value: 4 },
  { name: '5', value: 5 },
  { name: '6', value: 6 },
  { name: '7', value: 7 },
  { name: '8', value: 8 },
  { name: '9', value: 9 },
  { name: '10', value: 10 },
  { name: 'J', value: 11 },
  { name: 'Q', value: 12 },
  { name: 'K', value: 13 }
];

export function getDeck() {
  const deck = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({ suit, rank, faceUp: false});
    });
  });
  return deck;
}

export function shuffleTheDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    const j = Math.floor(Math.random() * deck.length);
    deck[i].faceUp = false;
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

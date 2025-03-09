const suits = [
  { name: 'hearts', symbol: '♥', color: 'red' },
  { name: 'diamonds', symbol: '♦', color: 'red' },
  { name: 'clubs', symbol: '♣', color: 'black' },
  { name: 'spades', symbol: '♠', color: 'black' }
];

const ranks = [
  { name: 'A', value: 14 },
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
      const card = { suit, rank, faceUp: false };
      deck.push(card);
    });
  });
  return deck;
}

export function removeTwoOfDiamonds(deck) {
  const newDeck = deck.filter(card => {
    return !(card.rank.name === '2' && card.suit.name === 'diamonds');
  });
  return newDeck;
}

function copyDeck(deck) {
  const newDeck = [];
  deck.forEach(card => {
    newDeck.push(copyCard(card));
  });
  return newDeck;
}

function copyCard(card) {
  return { ...card };
}

export function shuffleDeck(deck) {
  const newDeck = copyDeck(deck);
  const shuffledDeck = [];
  for (let i = 0; i < deck.length; i++) {
    const j = Math.floor(Math.random() * (newDeck.length - shuffledDeck.length));
    const card = newDeck.splice(j, 1)[0];
    shuffledDeck.push(card);
  }
  return shuffledDeck;
}

export function dealDeck(deck, playerCount) {
  const players = [];
  for (let i = 0; i < deck.length; i++) {
    const playerIndex = i % playerCount;
    if (!players[playerIndex]) {
      players[playerIndex] = {hand: []};
    }
    const card = copyCard(deck[i]);
    players[playerIndex].hand.push(card);
  }
  return players;
}

export function logDeck(deck, title) {
  if (title) {
    console.log('\n' + title);
  }
  deck.forEach(card => {
    logCard(card);
  });
}

export function logTricks(tricks) {
  console.log('\nTricks:');
  let trickIdx = 1;
  tricks.forEach(trick => {
    const line = trick.map(card => cardToString(card)).join('    ');
    console.log(line);
    trickIdx++;
  });
}

export function logCard(card) {
  console.log( cardToString(card) );
}

export function cardToString(card) {
  return `${card.rank.name} of ${card.suit.name}`;
}

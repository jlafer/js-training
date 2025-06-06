export function playTheGame(players) {
  const playerCount = players.length;
  const handCount = players[0].hand.length;
  const tricks = [];
  let lead = 0;
  for (let i = 0; i < handCount; i++) {
    const trick = {cards: [], lead: lead};
    let playerIdx = lead;
    for (let j = 0; j < playerCount; j++) {
      const card = chooseCard(trick, players[playerIdx].hand);
      trick.cards.push(card);
      playerIdx = (playerIdx + 1) % playerCount;
    }
    trick.score = getTrickScore(trick);
    trick.winner = getTrickWinner(trick);
    lead = trick.winner;
    tricks.push(trick);
  }
  return tricks;
}

export function scoreTheGame(tricks, players) {
  const playerCount = players.length;
  const scores = [];
  for (let i = 0; i < playerCount; i++) {
    scores[i] = 0;
  }
  tricks.forEach((trick) => {
    const winner = trick.winner;
    scores[winner] += trick.score;
  });
  players.forEach((player, idx) => {
    player.score = scores[idx];
  });
}

export function showScores(players) {
  console.log('\nScores:');
  players.forEach((player, idx) => {
    console.log(`Player ${idx} Score: ${player.score}`);
  });
}

function getTrickWinner(trick) {
  const cards = trick.cards;
  let playerIdx = trick.lead;
  const leadCard = cards[0];
  const leadSuit = leadCard.suit;
  let winner = -1;
  let highestRank = -1;
  cards.forEach((card) => {
    if (card.suit.name === leadSuit.name && card.rank.value > highestRank) {
      winner = playerIdx;
      highestRank = card.rank.value;
    }
    playerIdx = (playerIdx + 1) % cards.length;
  });
  return winner;
}

function getTrickScore(trick) {
  const cards = trick.cards;
  let score = 0;
  cards.forEach((card) => {
    if (card.suit.name === 'hearts') {
      score += 1;
    } else if (card.suit.name === 'spades' && card.rank.name === 'Q') {
      score += 13;
    }
  });
  return score;
}

function chooseCard(trick, hand) {
  if (trick.cards.length === 0) {
    return hand.pop();
  }
  const leadCard = trick.cards[0];
  const suit = leadCard.suit;
  const cardsInSuit = hand.filter(card => {
    return (card.suit.name === suit.name);
  });
  if (cardsInSuit.length === 0) {
    return sluffCard(hand);
  }
  const cardIdx = (suit.name === 'hearts')
    ? chooseLowestCard(suit, hand)
    : chooseHighestCard(suit, hand);
  const card = hand.splice(cardIdx, 1)[0];
  return card;
}

function sluffCard(hand) {
  return hand.pop();
}

function chooseLowestCard(suit, hand) {
  let cardIdx = -1;
  let lowestRank = 100;
  hand.forEach((card, idx) => {
    if (card.suit.name === suit.name && card.rank.value < lowestRank) {
      lowestRank = card.rank.value;
      cardIdx = idx;
    }
  });
  return cardIdx;
}

function chooseHighestCard(suit, hand) {
  let cardIdx = -1;
  let highestRank = -1;
  hand.forEach((card, idx) => {
    if (card.suit.name === suit.name && card.rank.value > highestRank) {
      highestRank = card.rank.value;
      cardIdx = idx;
    }
  });
  return cardIdx;
}
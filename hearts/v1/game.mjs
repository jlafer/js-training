export function playTheGame(players) {
  const playerCount = players.length;
  const handCount = players[0].hand.length;
  const tricks = [];
  for (let i = 0; i < handCount; i++) {
    const trick = [];
    for (let j = 0; j < playerCount; j++) {
      const card = chooseCard(trick, players[j].hand);
      trick.push(card);
    }
    tricks.push(trick);
  }
  return tricks;
}

function chooseCard(trick, hand) {
  if (trick.length === 0) {
    return hand.pop();
  }
  const leadCard = trick[0];
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
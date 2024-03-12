import readline from 'readline/promises';

import { playOneGame } from './solitaire.js';

const ui = {};

/*
  get the player's move, which can be one of the following:
  q - quit the game
  ds - move the top card from the discard pile to the suit column
  db <toColNum> - move the top card from the discard pile to a board column
  bs <fromColNum> - move the top card from a board column to a suit column
  bb <fromColNum> <toColNum> - move all face-up cards from one board column to another
  d - draw three cards from the player's cards and place them on the discard pile
  p - pick up the discard pile and add the cards to the player's cards
*/
ui.getPlayerMove = async (game) => {
  const move = {};
  const prompt = 'Enter your move (q, ds, db <toColNum>, bs <fromColNum>, bb <fromColNum> <toColNum>, d, p):';
  const ifce = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const moveStr = await ifce.question(prompt);
  console.log(`You entered:`, moveStr);
  if (moveStr === 'q') {
    move.cmd = 'quit';
  }
  else if (moveStr === 'ds') {
    move.cmd = 'discardToSuit';
  }
  else if (moveStr.startsWith('db')) {
    move.cmd = 'discardToBoard';
    move.toColNum = parseInt(moveStr.substring(3));
  }
  else if (moveStr.startsWith('bs')) {
    move.cmd = 'boardToSuit';
    move.fromColNum = parseInt(moveStr.substring(3));
  }
  else if (moveStr.startsWith('bb')) {
    move.cmd = 'boardToBoard';
    const [fromColumnStr, toColumnStr] = moveStr.substring(3).split(' ');
    move.fromColNum = parseInt(fromColumnStr);
    move.toColNum = parseInt(toColumnStr);
  }
  else if (moveStr === 'd') {
    move.cmd = 'drawThree';
  }
  else if (moveStr === 'p') {
    move.cmd = 'pickupDiscard';
  }
  else {
    console.log('Invalid move');
    move.cmd = 'invalid';
  }
  ifce.close();
  return move;
}

ui.showGameState = (game) => {
  console.log('');
  showSuitColumns(game);
  console.log(`Board cards:`);
  game.boardColumns.forEach((column, index) => {
    const columnString = column.map(card => card.faceUp ? getCardString(card) : 'XX').join(', ');
    console.log(`Column ${index + 1}: ${columnString}`);
  });
  showPlayerCards(game.playerCards);
  showDiscardPile(game.discardPile);
  console.log(`Game over: ${game.gameOver}`);
};

function showSuitColumns(game) {
  console.log(`Suit columns:`);
  for (const suit in game.suitColumns) {
    const suitColumn = game.suitColumns[suit];
    console.log(`${suit}: ${showListOfCards(suitColumn)}`);
  }
}

function showListOfCards(cards) {
  return cards.map(card => getCardString(card)).join(', ');
}

function showPlayerCards(playerCards) {
  console.log(`Player cards: ${playerCards.length}`);
}

function showDiscardPile(discardPile) {
  const discardStr = (discardPile.length === 0)
    ? 'No cards'
    : getCardString(discardPile[discardPile.length - 1]);
  console.log(`Discard pile: ${discardStr}`);
}

function getCardString(card) {
  return `${card.rank.name}${card.suit.symbol}`;
}

playOneGame(ui);
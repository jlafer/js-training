import { getDeck, shuffleTheDeck } from "./deck.js";

/**
 * This is a solitaire game. There are various arrays of cards:
 * - playerCards: the cards that the player can draw from; the top card is at the end of the array
 * - discardPile: the cards that the player has drawn from playerCards; the top card is at the end of the array
 *   when the player picks up the discard pile, the cards are added to playerCards in reverse order
 * - boardColumns: the starting cards that are dealt to the board; the top card of each column is at the end of each array
 * - suitColumns: the cards that are moved to the suit columns; the top card of each column is at the end of each array
 */

function dealTheCards(game) {
  shuffleTheDeck(game.deck);
  game.gameOver = false;
  game.suitColumns = {  hearts: [], diamonds: [], clubs: [], spades: [] };
  game.boardColumns = makeBoardColumns(game.deck);
  game.playerCards = game.deck;
  game.discardPile = [];
}

function makeBoardColumns(deck) {
  const boardColumns = [[], [], [], [], [], [], []];
  let boardColumn = 0;
  let firstColumnToFill = 0;
  for (let i = 0; i < 28; i++) {
    deck[0].faceUp = (boardColumn === firstColumnToFill);
    boardColumns[boardColumn].push(deck.shift());
    boardColumn++;
    if (boardColumn === 7) {
      firstColumnToFill++;
      boardColumn = firstColumnToFill;
    }
  }
  return boardColumns;
}

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
async function makePlayerMove(game, move) {
  const { cmd, fromColNum, toColNum } = move;
  switch (cmd) {
    case 'quit':
      game.gameOver = true;
      break;
    case 'discardToSuit':
      moveDiscardToSuitColumn(game);
      break;
    case 'discardToBoard':
      moveDiscardToBoardColumn(game, toColNum);
      break;
    case 'boardToSuit':
      moveBoardCardToSuitColumn(game, fromColNum);
      break;
    case 'boardToBoard':
      moveBoardColumn(game, fromColNum, toColNum);
      break;
    case 'drawThree':
      drawThreeCards(game);
      break;
    case 'pickupDiscard':
      pickupDiscardPile(game);
      break;
    default:
      console.log('Invalid move');
  }
}

function moveDiscardToSuitColumn(game) {
  const fromCard = game.discardPile.pop();
  const suitColumn = game.suitColumns[fromCard.suit.name];
  if (cardCanGoOnSuitColumn(suitColumn, fromCard)) {
    suitColumn.push(fromCard);
  } else {
    game.discardPile.push(fromCard);
  }
  if (allSuitColumnsFull(game)) {
    game.gameOver = true;
  }
  return game.gameOver;
}

function moveBoardCardToSuitColumn(game, fromColNum) {
  const fromBoardColumn = game.boardColumns[fromColNum - 1];
  const fromCard = fromBoardColumn.pop();
  const suitColumn = game.suitColumns[fromCard.suit.name];
  if (cardCanGoOnSuitColumn(suitColumn, fromCard)) {
    suitColumn.push(fromCard);
    turnOverTopBoardCard(fromBoardColumn);
  }
  else {
    console.log('Invalid move');
    fromBoardColumn.push(fromCard);
  }
  if (allSuitColumnsFull(game)) {
    game.gameOver = true;
  }
  return game.gameOver;
}

function moveBoardColumn(game, fromColNum, toColNum) {
  const fromBoardColumn = game.boardColumns[fromColNum - 1];
  const toBoardColumn = game.boardColumns[toColNum - 1];
  const bottomFromCardIdx = fromBoardColumn.findIndex(card => card.faceUp);
  const bottomFromCard = fromBoardColumn[bottomFromCardIdx];
  const toCard = toBoardColumn[toBoardColumn.length - 1];
  if (toBoardColumn.length === 0 && bottomFromCard.rank.name === 'K'
    || toBoardColumn.length > 0 && cardCanGoOnBoardCard(toCard, bottomFromCard)) {
    game.boardColumns[toColNum - 1] = toBoardColumn.concat(fromBoardColumn.splice(bottomFromCardIdx));
    turnOverTopBoardCard(fromBoardColumn);
  }
}

function moveDiscardToBoardColumn(game, toColNum) {
  const fromCard = game.discardPile.pop();
  const toBoardColumn = game.boardColumns[toColNum - 1];
  const topBoardCard = toBoardColumn[toBoardColumn.length - 1];
  if (toBoardColumn.length === 0 && fromCard.rank.name === 'K'
    || toBoardColumn.length > 0 && cardCanGoOnBoardCard(topBoardCard, fromCard)) {
    toBoardColumn.push(fromCard);
  } else {
    game.discardPile.push(fromCard);
  }
}

function drawThreeCards(game) {
  for (let i = 0; i < 3; i++) {
    if (game.playerCards.length > 0) {
      const card = game.playerCards.pop();
      card.faceUp = true;
      game.discardPile.push(card);
    }
  }
}

function pickupDiscardPile(game) {
  game.playerCards = game.discardPile.reverse();
  game.playerCards.forEach(card => card.faceUp = false);
  game.discardPile = [];
}

function turnOverTopBoardCard(boardColumn) {
  if (boardColumn.length > 0) {
    boardColumn[boardColumn.length - 1].faceUp = true;
  }
}

function allSuitColumnsFull(game) {
  return Object.values(game.suitColumns).every(column => column.length === 13);
}

function cardCanGoOnBoardCard(boardCard, card) {
  return boardCard.suit.color !== card.suit.color
    && boardCard.rank.value === card.rank.value + 1;
}

function cardCanGoOnSuitColumn(suitColumn, card) {
  return suitColumn.length === 0 && card.rank.name === 'A'
    || suitColumn.length > 0 && suitColumn[suitColumn.length - 1].rank.value === card.rank.value - 1;
}

export async function playOneGame(ui) {
  const game = { deck: getDeck() };
  dealTheCards(game);
  while (!game.gameOver) {
    ui.showGameState(game);
    const move = await ui.getPlayerMove(game);
    makePlayerMove(game, move);
  }
  ui.showGameState(game);
}

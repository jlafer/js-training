import { getDeck, shuffleDeck } from "./deck.js";
import readline from 'readline/promises';

/**
 * This is a solitaire game. There are various arrays of cards:
 * - playerCards: the cards that the player can draw from; the top card is at the end of the array
 * - discardPile: the cards that the player has drawn from playerCards; the top card is at the end of the array
 *   when the player picks up the discard pile, the cards are added to playerCards in reverse order
 * - columns: the starting cards that are dealt to the board; the top card of each column is at the end of each array
 * - suitColumns: the cards that are moved to the suit columns; the top card of each column is at the end of each array
 */
const game = {
  deck: getDeck(),
  columns: [],
  suitColumns: {},
  playerCards: [],
  discardPile: [],
};

function dealTheCards(game) {
  shuffleDeck(game.deck);
  game.gameOver = false;
  game.suitColumns = {  hearts: [], diamonds: [], clubs: [], spades: [] };
  game.columns = [];
  for (let i = 0; i < 7; i++) {
    game.columns.push([]);
  }
  let boardColumn = 0;
  let firstColumnToFill = 0;
  for (let i = 0; i < 28; i++) {
    game.deck[0].faceUp = (boardColumn === firstColumnToFill);
    game.columns[boardColumn].push(game.deck.shift());
    boardColumn++;
    if (boardColumn === 7) {
      firstColumnToFill++;
      boardColumn = firstColumnToFill;
    }
  }
  game.playerCards = game.deck;
  game.discardPile = [];
}

function showGameState(game) {
  console.log('');
  showSuitColumns(game);
  console.log(`Board cards:`);
  game.columns.forEach((column, index) => {
    const columnString = column.map(card => card.faceUp ? getCardString(card) : 'XX').join(', ');
    console.log(`Column ${index + 1}: ${columnString}`);
  });
  showPlayerCards(game.playerCards);
  showDiscardPile(game.discardPile);
  console.log(`Game over: ${game.gameOver}`);
}

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
async function getPlayerMove(game) {
  const prompt = 'Enter your move (q, ds, db <toColNum>, bs <fromColNum>, bb <fromColNum> <toColNum>, d, p):';
  const ifce = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const move = await ifce.question(prompt);
  console.log(`You entered:`, move);
  if (move === 'q') {
    game.gameOver = true;
  }
  else if (move === 'ds') {
    moveDiscardToSuitColumn(game);
  }
  else if (move.startsWith('db')) {
    const toColNum = parseInt(move.substring(3));
    moveDiscardToBoardColumn(game, toColNum);
  }
  else if (move.startsWith('bs')) {
    const fromColNum = parseInt(move.substring(3));
    moveBoardCardToSuitColumn(game, fromColNum);
  }
  else if (move.startsWith('bb')) {
    const [fromColumnStr, toColumnStr] = move.substring(3).split(' ');
    const fromColNum = parseInt(fromColumnStr);
    const toColNum = parseInt(toColumnStr);
    moveBoardColumn(game, fromColNum, toColNum);
  }
  else if (move === 'd') {
    drawThreeCards(game);
  }
  else if (move === 'p') {
    pickupDiscardPile(game);
  }
  else {
    console.log('Invalid move');
  }
  ifce.close();
  return game.gameOver;
}

function moveDiscardToSuitColumn(game) {
  const fromCard = game.discardPile.pop();
  const {suit, rank} = fromCard;
  const suitColumn = game.suitColumns[suit.name];
  if (suitColumn.length === 0 && rank.name === 'A'
    || suitColumn.length > 0 && suitColumn[suitColumn.length - 1].rank.value === rank.value - 1) {
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
  const fromBoardColumn = game.columns[fromColNum - 1];
  const fromCard = fromBoardColumn.pop();
  console.log(`moving card ${getCardString(fromCard)} from column ${fromColNum}`);
  const {suit, rank} = fromCard;
  const suitColumn = game.suitColumns[suit.name];
  console.log(`to suit column ${suit.name} with ${suitColumn.length} cards`);
  if (suitColumn.length === 0 && rank.name === 'A'
    || suitColumn.length > 0 && suitColumn[suitColumn.length - 1].rank.value === rank.value - 1) {
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
  const fromBoardColumn = game.columns[fromColNum - 1];
  const toBoardColumn = game.columns[toColNum - 1];
  const bottomFromCardIdx = fromBoardColumn.findIndex(card => card.faceUp);
  const bottomFromCard = fromBoardColumn[bottomFromCardIdx];
  const toCard = toBoardColumn[toBoardColumn.length - 1];
  if (toBoardColumn.length === 0 && bottomFromCard.rank.name === 'K'
    || toBoardColumn.length > 0 && cardCanGoOnBoardCard(toCard, bottomFromCard)) {
    game.columns[toColNum - 1] = toBoardColumn.concat(fromBoardColumn.splice(bottomFromCardIdx));
    turnOverTopBoardCard(fromBoardColumn);
  }
}

function moveDiscardToBoardColumn(game, toColNum) {
  const fromCard = game.discardPile.pop();
  const toBoardColumn = game.columns[toColNum - 1];
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
async function playOneGame() {
  const game = {
    deck: getDeck(),
    columns: [],
    suitColumns: [],
    playerCards: [],
    discardPile: [],
  };
  dealTheCards(game);
  while (!game.gameOver) {
    showGameState(game);
    game.gameOver = await getPlayerMove(game);
  }
  showGameState(game);
}

playOneGame();
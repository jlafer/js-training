import {
  getDeck, logDeck, logTricks, removeTwoOfDiamonds, shuffleDeck, dealDeck
} from './deck.mjs';
import { playTheGame, scoreTheGame, showScores } from './game.mjs';

const deck = getDeck();
const deckForHeartsThreePlayer = removeTwoOfDiamonds(deck);
const shuffled = shuffleDeck(deckForHeartsThreePlayer);
logDeck(shuffled, 'Shuffled Deck');
const players = dealDeck(shuffled, 3);
logDeck(players[0].hand, 'Player 1 Hand');
logDeck(players[1].hand, 'Player 2 Hand');
logDeck(players[2].hand, 'Player 3 Hand');
const tricks = playTheGame(players);
scoreTheGame(tricks, players);
logTricks(tricks);
showScores(players)

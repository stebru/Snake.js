import game from './game.js';
import settings from './settings.js';

game.start();

var snake = game.board.snake,
  keycodes = settings.keycodes,
  directions = settings.directions;

import game from './game.js';
import settings from './settings.js';

game.start();

var snake = game.board.snake,
  keycodes = settings.keycodes,
  directions = settings.directions;

document.addEventListener('keydown', function(event) {
  if (event.keyCode === keycodes.UP && snake.direction !== directions.DOWN) {
    snake.direction = directions.UP;
  } else if (event.keyCode === keycodes.DOWN && snake.direction !== directions.UP) {
    snake.direction = directions.DOWN;
  } else if (event.keyCode === keycodes.RIGHT && snake.direction !== directions.LEFT) {
    snake.direction = directions.RIGHT;
  } else if (event.keyCode === keycodes.LEFT && snake.direction !== directions.RIGHT) {
    snake.direction = directions.LEFT;
  }

  if (event.keyCode === keycodes.SPACE) {
    game.start();
  }
});

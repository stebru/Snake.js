import boardProto from './boardProto.js';
import settings from './settings.js';

var game = Object.create({
  updateScore() {
    this.score += this.nextScore;
    this.scoreElement.innerHTML = this.score;
    this.speed -= 1;
    this.nextScore += 5;
  },

  resetScore() {
    this.score = 0;
    this.scoreElement.innerHTML = this.score;
  },

  gameOver() {
    window.cancelAnimationFrame(this.raf);
  },

  start() {
    this.boardElement = document.getElementById('board');
    this.scoreElement = document.getElementById('score');

    if (this.board) {
      this.board.clear(this);
    }

    this.gameOver();
    this.resetScore();

    this.board = Object.create(boardProto);
    this.board.numRows = 20;
    this.board.numCols = 20;
    this.board.createMatrix(this.boardElement);

    this.board.createSnake();
    this.board.addFruit();

    this.score = 0;
    this.speed = 100;
    this.lastTick = 0;
    this.nextScore = 10;

    this.listen();

    window.requestAnimationFrame(this.run.bind(this));
  },

  listen() {
    if (this.listener) {
      document.removeEventListener('keydown', this.listener);
    }
    this.listener = this.keys.bind(this);
    document.addEventListener('keydown', this.listener);
  },

  keys(event) {

    var snake = this.board.snake,
      keycodes = settings.keycodes,
      directions = settings.directions;

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
  },

  run(timestamp) {
    this.raf = window.requestAnimationFrame(this.run.bind(this));

    if ((timestamp - this.lastTick) < this.speed) {
      return false;
    }
    this.lastTick = timestamp;

    this.board.draw();
  }
});

export
default game;

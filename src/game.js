import boardProto from './boardProto.js';

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
    this.isGameOver = true;
  },

  start() {

    this.boardElement = document.getElementById('board');
    this.scoreElement = document.getElementById('score');

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

    this.isGameOver = false;
    window.requestAnimationFrame(this.run.bind(this));
  },

  run(timestamp) {

    window.requestAnimationFrame(this.run.bind(this));

    if (this.isGameOver) {
      return;
    }

    if ((timestamp - this.lastTick) < this.speed) {
      return false;
    }
    this.lastTick = timestamp;

    this.board.draw();
  }
});

export
default game;

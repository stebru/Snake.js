import game from './game.js';

var tileProto = {
  paintSnakePart() {
    this.element.classList.add('on');
    if (this.occupiedBy.isHead) {
      this.element.classList.add('head');
    }
  },

  clearTile() {
    this.element.classList.remove('on', 'head');
  },

  addSnakePart(snakePart) {
    if (this.hasFruit) {
      this.removeFruit();
      game.updateScore();
      var body = Object.create({});
      var tailTile = game.board.snake.bodyParts[game.board.snake.bodyParts.length - 1].tile;
      body.tile = tailTile.addSnakePart(body);
      game.board.snake.bodyParts.push(body);
      game.board.addFruit();
    } else if (snakePart.isHead && this.occupiedBy) {
      game.gameOver();
      return false;
    }
    this.occupiedBy = snakePart;
    snakePart.tile = this;
    this.paintSnakePart();
    return this;
  },

  removeSnakePart() {
    this.occupiedBy = null;
    this.clearTile();
    return this;
  },

  hasSnakePart() {
    return this.occupiedBy != null;
  },

  addFruit() {
    this.hasFruit = true;
    this.paintFruit();
  },

  removeFruit() {
    this.hasFruit = false;
    this.element.classList.remove('fruit');
  },

  paintFruit() {
    this.element.classList.add('fruit');
  }
};

export
default tileProto;

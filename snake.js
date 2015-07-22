var snake;
var boardElement = document.getElementById('board');
var scoreElement = document.getElementById('score');

var directions = {
  UP: 1,
  DOWN: 2,
  LEFT: 4,
  RIGHT: 8
};

var keycodes = {
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37
};

var bodyProto = {};

var snakeProto = {
  getLength: function() {
    return this.bodyParts.length;
  },

  getHead: function() {
    return this.bodyParts[0];
  },

  getTail: function() {
    return this.bodyParts[this.bodyParts.length - 1];
  }
};

var tileProto = {
  paintSnakePart: function() {
    this.element.classList.add('on');
    if (this.occupiedBy.isHead) {
      this.element.classList.add('head');
    }
  },
  clearTile: function() {
    this.element.classList.remove('on', 'head', 'tail');
  },
  addSnakePart: function(snakePart) {
    if (this.hasFruit) {
      game.updateScore(10);
      this.removeFruit();
      board.addFruit();
      var body = Object.create(bodyProto);
      var tailTile = snake.bodyParts[snake.bodyParts.length - 1].tile;
      body.tile = tailTile.addSnakePart(body);
      snake.bodyParts.push(body);
    } else if (snakePart.isHead && this.occupiedBy) {
      game.gameOver();
      return false;
    }
    this.occupiedBy = snakePart;
    snakePart.tile = this;
    this.paintSnakePart();
    return this;
  },
  removeSnakePart: function() {
    this.occupiedBy = null;
    this.clearTile();
    return this;
  },
  hasSnakePart: function() {
    return this.occupiedBy != null;
  },
  addFruit: function() {
    this.hasFruit = true;
    this.paintFruit();
  },
  removeFruit: function() {
    this.hasFruit = false;
    this.element.classList.remove('fruit');
  },
  paintFruit: function() {
    this.element.classList.add('fruit');
  }
};

var last;
var DELTA = 100;
var boardProto = {

  getTileAt: function(row, col) {
    var rowObj = this.rows[row];
    return rowObj.tiles[col];
  },

  addFruit: function() {
    var rndRow = Math.floor(Math.random() * board.numRows);
    var rndCol = Math.floor(Math.random() * board.numCols);
    var tile = board.getTileAt(rndRow, rndCol);
    tile.addFruit();
  },

  createSnake: function() {
    snake = Object.create(snakeProto);

    snake.speed = 10;
    snake.direction = directions.RIGHT;
    snake.bodyParts = [];

    var head = Object.create(bodyProto);
    head.isHead = true;
    head.tile = board.rows[4].tiles[5].addSnakePart(head);
    snake.bodyParts.push(head);

    var body = Object.create(bodyProto);
    body.tile = board.rows[4].tiles[4].addSnakePart(body);
    snake.bodyParts.push(body);

    var body = Object.create(bodyProto);
    body.tile = board.rows[4].tiles[3].addSnakePart(body);
    snake.bodyParts.push(body);
  },

  createMatrix: function() {

    var fragment = document.createDocumentFragment();
    var row, col;

    for (var i = 0; i < this.numRows; i++) {
      row = document.createElement('div');
      row.classList.add('row');

      var rowObj = Object.create(null);
      rowObj.index = i;
      rowObj.tiles = [];

      for (var j = 0; j < this.numCols; j++) {
        col = document.createElement('div');
        col.classList.add('col');
        row.appendChild(col);

        var tile = Object.create(tileProto);
        tile.index = j;
        tile.row = i;
        tile.col = j;
        tile.occupiedBy = null;

        tile.element = col;
        rowObj.tiles.push(tile);
      }
      this.rows.push(rowObj);
      fragment.appendChild(row);
    }
    boardElement.appendChild(fragment);

    this.createSnake();
    this.addFruit();

    window.requestAnimationFrame(run);
  },

  draw: function(timestamp) {



    var snakeHead = snake.getHead();
    var moveToRow, moveToCol;

    switch (snake.direction) {
      case directions.UP:
        moveToRow = snakeHead.tile.row - 1;
        moveToCol = snakeHead.tile.col;
        break;
      case directions.DOWN:
        moveToRow = snakeHead.tile.row + 1;
        moveToCol = snakeHead.tile.col;
        break;
      case directions.RIGHT:
        moveToRow = snakeHead.tile.row;
        moveToCol = snakeHead.tile.col + 1;
        break;
      case directions.LEFT:
        moveToRow = snakeHead.tile.row;
        moveToCol = snakeHead.tile.col - 1;
        break;
    }

    if (moveToRow < 0) {
      moveToRow = board.numRows - 1;
    } else if (moveToRow > board.numRows - 1) {
      moveToRow = 0;
    } else if (moveToCol > board.numRows - 1) {
      moveToCol = 0;
    } else if (moveToCol < 0) {
      moveToCol = board.numRows - 1;
    }

    var moveToTile = board.getTileAt(moveToRow, moveToCol);

    for (var b = 0; b < snake.bodyParts.length; b++) {

      var currentBodyPart = snake.bodyParts[b];

      var prevTile = currentBodyPart.tile;

      currentBodyPart.tile = moveToTile.addSnakePart(currentBodyPart);
      if (currentBodyPart.tile === false) {
        break;
      }
      prevTile.removeSnakePart();

      moveToTile = prevTile;
    }
  }
};

var board = Object.create(boardProto);
board.rows = [];
board.numRows = 20;
board.numCols = 20;

board.createMatrix();

var game = Object.create({
  updateScore: function(addPoints) {
    this.score += addPoints;
    scoreElement.innerHTML = this.score;
  },
  gameOver: function() {
    this.isGameOver = true;
  }
});
game.score = 0;

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
});

function run(timestamp) {

  window.requestAnimationFrame(run);

  if (game.isGameOver) {
    return;
  }

  if ((timestamp - last) < DELTA) {
    return false;
  }
  last = timestamp;

  board.draw(timestamp);
}

var snake;
var boardElement = document.getElementById('board');
var directions = {
  UP: 1,
  DOWN: 2,
  LEFT: 4,
  RIGHT: 8
};

var board = Object.create({});
board.rows = [];
board.numRows = 10;
board.numCols = 10;

document.addEventListener('keydown', function(event) {
  console.log(event);
  if (event.keyCode === 38) {
    snake.direction = directions.UP;
  } else if (event.keyCode === 40) {
    snake.direction = directions.DOWN;
  } else if (event.keyCode === 39) {
    snake.direction = directions.RIGHT;
  } else if (event.keyCode === 37) {
    snake.direction = directions.LEFT;
  }
});

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

var bodyProto = {};

var tileProto = {
  paintSnakePart: function() {
    this.element.classList.add('on');
    if (this.occupiedBy.isHead) {
      this.element.classList.add('head');
      this.element.innerHTML = 'H';
    }
    if (this.occupiedBy.isTail) {
      this.element.classList.add('tail');
      this.element.innerHTML = 'T';
    }
  },
  clearTile: function() {
    this.element.classList.remove('on', 'head', 'tail');
    this.element.innerHTML = '';
  },
  addSnakePart: function(snakePart) {
    this.occupiedBy = snakePart;
    snakePart.tile = this;
    if (snakePart.isHead) {
      this.isOccupiedByHead = true;
    } else if (snakePart.isTail) {
      this.isOccupiedByTail = true;
    }

    this.paintSnakePart();

    return this;
  },
  removeSnakePart: function() {
    this.occupiedBy = null;
    this.isOccupiedByHead = false;
    this.isOccupiedByTail = false;

    this.clearTile();

    return this;
  },
  hasSnakePart: function() {
    return this.occupiedBy != null;
  }
};

(function createMatrix() {


  var fragment = document.createDocumentFragment();
  var row, col;

  for (var i = 0; i < board.numRows; i++) {
    row = document.createElement('div');
    row.classList.add('row');

    var rowObj = Object.create(null);
    rowObj.index = i;
    rowObj.tiles = [];

    for (var j = 0; j < board.numCols; j++) {
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
    board.rows.push(rowObj);
    fragment.appendChild(row);
  }
  boardElement.appendChild(fragment);

  var snake = createSnake();

  window.requestAnimationFrame(game);
})();

function createSnake() {
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

  var tail = Object.create(bodyProto);
  tail.isTail = true;
  tail.tile = board.rows[4].tiles[3].addSnakePart(tail);
  snake.bodyParts.push(tail);
}

function getTileAt(row, col) {
  var rowObj = board.rows[row];
  return rowObj.tiles[col];
}

function draw() {

  var snakeHead = snake.getHead();
  var moveToRow, moveToCol;

  if (snake.direction === directions.UP) {
    moveToRow = snakeHead.tile.row - 1;
    moveToCol = snakeHead.tile.col;
  } else if (snake.direction === directions.DOWN) {
    moveToRow = snakeHead.tile.row + 1;
    moveToCol = snakeHead.tile.col;
  } else if (snake.direction === directions.RIGHT) {
    moveToRow = snakeHead.tile.row;
    moveToCol = snakeHead.tile.col + 1;
  } else if (snake.direction === directions.LEFT) {
    moveToRow = snakeHead.tile.row;
    moveToCol = snakeHead.tile.col - 1;
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

  var moveToTile = getTileAt(moveToRow, moveToCol);

  for (var b = 0; b < snake.bodyParts.length; b++) {

    var currentBodyPart = snake.bodyParts[b];

    var prevTile = currentBodyPart.tile;
    prevTile.removeSnakePart();

    currentBodyPart.tile = moveToTile.addSnakePart(currentBodyPart);

    moveToTile = prevTile;
  }
}

var last;
var DELTA = 100;

function game(timestamp) {
  window.requestAnimationFrame(game);
  if ((timestamp - last) < DELTA) {
    return;
  }
  draw();
  last = timestamp;
}

import tileProto from './tileProto.js';
import snakeProto from './snakeProto.js';
import settings from './settings.js';

var boardProto = {

  getTileAt(row, col) {
    var rowObj = this.rows[row];
    return rowObj.tiles[col];
  },

  addFruit() {

    var isTileOccupied = true;
    do {
      var rndRow = Math.floor(Math.random() * this.numRows);
      var rndCol = Math.floor(Math.random() * this.numCols);
      var tile = this.getTileAt(rndRow, rndCol);
      isTileOccupied = !!tile.occupiedBy;
    } while (isTileOccupied);

    tile.addFruit();
  },

  createMatrix(boardElement) {

    this.rows = [];
    this.fragment = document.createDocumentFragment();
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
      this.fragment.appendChild(row);
    }
    boardElement.appendChild(this.fragment);
  },

  createSnake() {
    var directions = settings.directions;
    var snake = Object.create(snakeProto);

    snake.direction = directions.RIGHT;
    snake.bodyParts = [];

    var head = Object.create({});
    head.isHead = true;
    head.tile = this.rows[4].tiles[5].addSnakePart(head);
    snake.bodyParts.push(head);

    var body = Object.create({});
    body.tile = this.rows[4].tiles[4].addSnakePart(body);
    snake.bodyParts.push(body);

    var body = Object.create({});
    body.tile = this.rows[4].tiles[3].addSnakePart(body);
    snake.bodyParts.push(body);

    this.snake = snake;
  },

  clear(game) {
    this.snake = null;
    game.boardElement.innerHTML = null;
    game.scoreElement.innerHTML = '0';
  },

  draw(snake) {
    var snakeHead = this.snake.getHead();
    var moveToRow, moveToCol;
    var directions = settings.directions;

    switch (this.snake.direction) {
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
      moveToRow = this.numRows - 1;
    } else if (moveToRow > this.numRows - 1) {
      moveToRow = 0;
    } else if (moveToCol > this.numRows - 1) {
      moveToCol = 0;
    } else if (moveToCol < 0) {
      moveToCol = this.numRows - 1;
    }

    var moveToTile = this.getTileAt(moveToRow, moveToCol);

    for (var b = 0; b < this.snake.bodyParts.length; b++) {

      var currentBodyPart = this.snake.bodyParts[b];
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

export
default boardProto;

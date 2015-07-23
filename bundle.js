(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tileProtoJs = require('./tileProto.js');

var _tileProtoJs2 = _interopRequireDefault(_tileProtoJs);

var _snakeProtoJs = require('./snakeProto.js');

var _snakeProtoJs2 = _interopRequireDefault(_snakeProtoJs);

var boardProto = {

  getTileAt: function getTileAt(row, col) {
    var rowObj = this.rows[row];
    return rowObj.tiles[col];
  },

  addFruit: function addFruit() {

    var isTileOccupied = true;
    do {
      var rndRow = Math.floor(Math.random() * board.numRows);
      var rndCol = Math.floor(Math.random() * board.numCols);
      var tile = board.getTileAt(rndRow, rndCol);
      isTileOccupied = !!tile.occupiedBy;
    } while (isTileOccupied);

    tile.addFruit();
  },

  createMatrix: function createMatrix() {

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

        var tile = Object.create(_tileProtoJs2['default']);
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

  draw: function draw(snake) {

    var snakeHead = this.snake.getHead();
    var moveToRow, moveToCol;

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
      moveToRow = board.numRows - 1;
    } else if (moveToRow > board.numRows - 1) {
      moveToRow = 0;
    } else if (moveToCol > board.numRows - 1) {
      moveToCol = 0;
    } else if (moveToCol < 0) {
      moveToCol = board.numRows - 1;
    }

    var moveToTile = board.getTileAt(moveToRow, moveToCol);

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
  },

  createSnake: function createSnake() {
    var snake = Object.create(_snakeProtoJs2['default']);

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

    this.snake = snake;
  }
};

exports['default'] = boardProto;
module.exports = exports['default'];

},{"./snakeProto.js":5,"./tileProto.js":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _boardProtoJs = require('./boardProto.js');

var _boardProtoJs2 = _interopRequireDefault(_boardProtoJs);

var game = Object.create({
  updateScore: function updateScore() {
    this.score += this.nextScore;
    scoreElement.innerHTML = this.score;
    this.speed -= 1;
    this.nextScore += 5;
  },

  resetScore: function resetScore() {
    this.score = 0;
    scoreElement.innerHTML = this.score;
  },

  gameOver: function gameOver() {
    this.isGameOver = true;
  },

  start: function start() {
    this.gameOver();
    this.resetScore();

    this.board = Object.create(_boardProtoJs2['default']);
    this.board.rows = [];
    this.board.numRows = 20;
    this.board.numCols = 20;
    this.board.createMatrix();

    this.board.createSnake();
    this.board.addFruit();

    this.score = 0;
    this.speed = 100;
    this.lastTick = 0;
    this.nextScore = 10;

    this.isGameOver = false;
    window.requestAnimationFrame(run);
  },

  run: (function (_run) {
    function run(_x) {
      return _run.apply(this, arguments);
    }

    run.toString = function () {
      return _run.toString();
    };

    return run;
  })(function (timestamp) {

    window.requestAnimationFrame(run);

    if (this.isGameOver) {
      return;
    }

    if (timestamp - this.lastTick < this.speed) {
      return false;
    }
    this.lastTick = timestamp;

    this.board.draw();
  })
});

exports['default'] = {
  game: game, run: run
};
module.exports = exports['default'];

},{"./boardProto.js":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gameJs = require('./game.js');

var _gameJs2 = _interopRequireDefault(_gameJs);

var _settingsJs = require('./settings.js');

var _settingsJs2 = _interopRequireDefault(_settingsJs);

var boardElement = document.getElementById('board');
var scoreElement = document.getElementById('score');

var snake = _gameJs2['default'].board.snake,
    keycodes = _settingsJs2['default'].keycodes,
    directions = _settingsJs2['default'].directions;

document.addEventListener('keydown', function (event) {
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
    _gameJs2['default'].start();
  }
});

_gameJs2['default'].start();

exports['default'] = {
  boardElement: boardElement, scoreElement: scoreElement
};
module.exports = exports['default'];

},{"./game.js":2,"./settings.js":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
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
	LEFT: 37,
	SPACE: 32
};

exports["default"] = {
	directions: directions,
	keycodes: keycodes
};
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var bodyProto = {};

var snakeProto = {
  getLength: function getLength() {
    return this.bodyParts.length;
  },

  getHead: function getHead() {
    return this.bodyParts[0];
  },

  getTail: function getTail() {
    return this.bodyParts[this.bodyParts.length - 1];
  }
};

exports["default"] = snakeProto;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gameJs = require('./game.js');

var _gameJs2 = _interopRequireDefault(_gameJs);

var tileProto = {
  paintSnakePart: function paintSnakePart() {
    this.element.classList.add('on');
    if (this.occupiedBy.isHead) {
      this.element.classList.add('head');
    }
  },

  clearTile: function clearTile() {
    this.element.classList.remove('on', 'head');
  },

  addSnakePart: function addSnakePart(snakePart) {
    if (this.hasFruit) {
      this.removeFruit();
      _gameJs2['default'].updateScore();
      var body = Object.create(bodyProto);
      var tailTile = _gameJs2['default'].snake.bodyParts[snake.bodyParts.length - 1].tile;
      body.tile = tailTile.addSnakePart(body);
      _gameJs2['default'].snake.bodyParts.push(body);
      board.addFruit();
    } else if (snakePart.isHead && this.occupiedBy) {
      _gameJs2['default'].gameOver();
      return false;
    }
    this.occupiedBy = snakePart;
    snakePart.tile = this;
    this.paintSnakePart();
    return this;
  },

  removeSnakePart: function removeSnakePart() {
    this.occupiedBy = null;
    this.clearTile();
    return this;
  },

  hasSnakePart: function hasSnakePart() {
    return this.occupiedBy != null;
  },

  addFruit: function addFruit() {
    this.hasFruit = true;
    this.paintFruit();
  },

  removeFruit: function removeFruit() {
    this.hasFruit = false;
    this.element.classList.remove('fruit');
  },

  paintFruit: function paintFruit() {
    this.element.classList.add('fruit');
  }
};

exports['default'] = tileProto;
module.exports = exports['default'];

},{"./game.js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RlZmFuYnJ1dmlrL2dpdC9zbmFrZS9zcmMvYm9hcmRQcm90by5qcyIsIi9Vc2Vycy9zdGVmYW5icnV2aWsvZ2l0L3NuYWtlL3NyYy9nYW1lLmpzIiwiL1VzZXJzL3N0ZWZhbmJydXZpay9naXQvc25ha2Uvc3JjL2luZGV4LmpzIiwiL1VzZXJzL3N0ZWZhbmJydXZpay9naXQvc25ha2Uvc3JjL3NldHRpbmdzLmpzIiwiL1VzZXJzL3N0ZWZhbmJydXZpay9naXQvc25ha2Uvc3JjL3NuYWtlUHJvdG8uanMiLCIvVXNlcnMvc3RlZmFuYnJ1dmlrL2dpdC9zbmFrZS9zcmMvdGlsZVByb3RvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7MkJDQXNCLGdCQUFnQjs7Ozs0QkFDZixpQkFBaUI7Ozs7QUFFeEMsSUFBSSxVQUFVLEdBQUc7O0FBRWYsV0FBUyxFQUFBLG1CQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDbEIsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixXQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDMUI7O0FBRUQsVUFBUSxFQUFBLG9CQUFHOztBQUVULFFBQUksY0FBYyxHQUFHLElBQUksQ0FBQztBQUMxQixPQUFHO0FBQ0QsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RCxVQUFJLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFD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QyxlQUFlLEVBQUUsQ0FBQzs7QUFFM0IsZ0JBQVUsR0FBRyxRQUFRLENBQUM7S0FDdkI7R0FDRjs7QUFFRCxhQUFXLEVBQUEsdUJBQUc7QUFDWixRQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSwyQkFBWSxDQUFDOztBQUV0QyxTQUFLLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7QUFDbkMsU0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFFBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEQsU0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLFFBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsUUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEQsU0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLFFBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsUUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEQsU0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7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QUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN0QixRQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDeEM7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3JDO0NBQ0YsQ0FBQzs7cUJBR00sU0FBUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgdGlsZVByb3RvIGZyb20gJy4vdGlsZVByb3RvLmpzJztcbmltcG9ydCBzbmFrZVByb3RvIGZyb20gJy4vc25ha2VQcm90by5qcyc7XG5cbnZhciBib2FyZFByb3RvID0ge1xuXG4gIGdldFRpbGVBdChyb3csIGNvbCkge1xuICAgIHZhciByb3dPYmogPSB0aGlzLnJvd3Nbcm93XTtcbiAgICByZXR1cm4gcm93T2JqLnRpbGVzW2NvbF07XG4gIH0sXG5cbiAgYWRkRnJ1aXQoKSB7XG5cbiAgICB2YXIgaXNUaWxlT2NjdXBpZWQgPSB0cnVlO1xuICAgIGRvIHtcbiAgICAgIHZhciBybmRSb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBib2FyZC5udW1Sb3dzKTtcbiAgICAgIHZhciBybmRDb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBib2FyZC5udW1Db2xzKTtcbiAgICAgIHZhciB0aWxlID0gYm9hcmQuZ2V0VGlsZUF0KHJuZFJvdywgcm5kQ29sKTtcbiAgICAgIGlzVGlsZU9jY3VwaWVkID0gISF0aWxlLm9jY3VwaWVkQnk7XG4gICAgfSB3aGlsZSAoaXNUaWxlT2NjdXBpZWQpO1xuXG4gICAgdGlsZS5hZGRGcnVpdCgpO1xuICB9LFxuXG4gIGNyZWF0ZU1hdHJpeCgpIHtcblxuICAgIHRoaXMuZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgdmFyIHJvdywgY29sO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bVJvd3M7IGkrKykge1xuICAgICAgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICByb3cuY2xhc3NMaXN0LmFkZCgncm93Jyk7XG5cbiAgICAgIHZhciByb3dPYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgcm93T2JqLmluZGV4ID0gaTtcbiAgICAgIHJvd09iai50aWxlcyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMubnVtQ29sczsgaisrKSB7XG4gICAgICAgIGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb2wuY2xhc3NMaXN0LmFkZCgnY29sJyk7XG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2wpO1xuXG4gICAgICAgIHZhciB0aWxlID0gT2JqZWN0LmNyZWF0ZSh0aWxlUHJvdG8pO1xuICAgICAgICB0aWxlLmluZGV4ID0gajtcbiAgICAgICAgdGlsZS5yb3cgPSBpO1xuICAgICAgICB0aWxlLmNvbCA9IGo7XG4gICAgICAgIHRpbGUub2NjdXBpZWRCeSA9IG51bGw7XG5cbiAgICAgICAgdGlsZS5lbGVtZW50ID0gY29sO1xuICAgICAgICByb3dPYmoudGlsZXMucHVzaCh0aWxlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucm93cy5wdXNoKHJvd09iaik7XG4gICAgICB0aGlzLmZyYWdtZW50LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgfVxuICAgIGJvYXJkRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmZyYWdtZW50KTtcbiAgfSxcblxuICBkcmF3KHNuYWtlKSB7XG5cbiAgICB2YXIgc25ha2VIZWFkID0gdGhpcy5zbmFrZS5nZXRIZWFkKCk7XG4gICAgdmFyIG1vdmVUb1JvdywgbW92ZVRvQ29sO1xuXG4gICAgc3dpdGNoICh0aGlzLnNuYWtlLmRpcmVjdGlvbikge1xuICAgICAgY2FzZSBkaXJlY3Rpb25zLlVQOlxuICAgICAgICBtb3ZlVG9Sb3cgPSBzbmFrZUhlYWQudGlsZS5yb3cgLSAxO1xuICAgICAgICBtb3ZlVG9Db2wgPSBzbmFrZUhlYWQudGlsZS5jb2w7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBkaXJlY3Rpb25zLkRPV046XG4gICAgICAgIG1vdmVUb1JvdyA9IHNuYWtlSGVhZC50aWxlLnJvdyArIDE7XG4gICAgICAgIG1vdmVUb0NvbCA9IHNuYWtlSGVhZC50aWxlLmNvbDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRpcmVjdGlvbnMuUklHSFQ6XG4gICAgICAgIG1vdmVUb1JvdyA9IHNuYWtlSGVhZC50aWxlLnJvdztcbiAgICAgICAgbW92ZVRvQ29sID0gc25ha2VIZWFkLnRpbGUuY29sICsgMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRpcmVjdGlvbnMuTEVGVDpcbiAgICAgICAgbW92ZVRvUm93ID0gc25ha2VIZWFkLnRpbGUucm93O1xuICAgICAgICBtb3ZlVG9Db2wgPSBzbmFrZUhlYWQudGlsZS5jb2wgLSAxO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAobW92ZVRvUm93IDwgMCkge1xuICAgICAgbW92ZVRvUm93ID0gYm9hcmQubnVtUm93cyAtIDE7XG4gICAgfSBlbHNlIGlmIChtb3ZlVG9Sb3cgPiBib2FyZC5udW1Sb3dzIC0gMSkge1xuICAgICAgbW92ZVRvUm93ID0gMDtcbiAgICB9IGVsc2UgaWYgKG1vdmVUb0NvbCA+IGJvYXJkLm51bVJvd3MgLSAxKSB7XG4gICAgICBtb3ZlVG9Db2wgPSAwO1xuICAgIH0gZWxzZSBpZiAobW92ZVRvQ29sIDwgMCkge1xuICAgICAgbW92ZVRvQ29sID0gYm9hcmQubnVtUm93cyAtIDE7XG4gICAgfVxuXG4gICAgdmFyIG1vdmVUb1RpbGUgPSBib2FyZC5nZXRUaWxlQXQobW92ZVRvUm93LCBtb3ZlVG9Db2wpO1xuXG4gICAgZm9yICh2YXIgYiA9IDA7IGIgPCB0aGlzLnNuYWtlLmJvZHlQYXJ0cy5sZW5ndGg7IGIrKykge1xuXG4gICAgICB2YXIgY3VycmVudEJvZHlQYXJ0ID0gdGhpcy5zbmFrZS5ib2R5UGFydHNbYl07XG5cbiAgICAgIHZhciBwcmV2VGlsZSA9IGN1cnJlbnRCb2R5UGFydC50aWxlO1xuXG4gICAgICBjdXJyZW50Qm9keVBhcnQudGlsZSA9IG1vdmVUb1RpbGUuYWRkU25ha2VQYXJ0KGN1cnJlbnRCb2R5UGFydCk7XG4gICAgICBpZiAoY3VycmVudEJvZHlQYXJ0LnRpbGUgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgcHJldlRpbGUucmVtb3ZlU25ha2VQYXJ0KCk7XG5cbiAgICAgIG1vdmVUb1RpbGUgPSBwcmV2VGlsZTtcbiAgICB9XG4gIH0sXG5cbiAgY3JlYXRlU25ha2UoKSB7XG4gICAgdmFyIHNuYWtlID0gT2JqZWN0LmNyZWF0ZShzbmFrZVByb3RvKTtcblxuICAgIHNuYWtlLmRpcmVjdGlvbiA9IGRpcmVjdGlvbnMuUklHSFQ7XG4gICAgc25ha2UuYm9keVBhcnRzID0gW107XG5cbiAgICB2YXIgaGVhZCA9IE9iamVjdC5jcmVhdGUoYm9keVByb3RvKTtcbiAgICBoZWFkLmlzSGVhZCA9IHRydWU7XG4gICAgaGVhZC50aWxlID0gYm9hcmQucm93c1s0XS50aWxlc1s1XS5hZGRTbmFrZVBhcnQoaGVhZCk7XG4gICAgc25ha2UuYm9keVBhcnRzLnB1c2goaGVhZCk7XG5cbiAgICB2YXIgYm9keSA9IE9iamVjdC5jcmVhdGUoYm9keVByb3RvKTtcbiAgICBib2R5LnRpbGUgPSBib2FyZC5yb3dzWzRdLnRpbGVzWzRdLmFkZFNuYWtlUGFydChib2R5KTtcbiAgICBzbmFrZS5ib2R5UGFydHMucHVzaChib2R5KTtcblxuICAgIHZhciBib2R5ID0gT2JqZWN0LmNyZWF0ZShib2R5UHJvdG8pO1xuICAgIGJvZHkudGlsZSA9IGJvYXJkLnJvd3NbNF0udGlsZXNbM10uYWRkU25ha2VQYXJ0KGJvZHkpO1xuICAgIHNuYWtlLmJvZHlQYXJ0cy5wdXNoKGJvZHkpO1xuXG4gICAgdGhpcy5zbmFrZSA9IHNuYWtlO1xuICB9XG59O1xuXG5leHBvcnRcbmRlZmF1bHQgYm9hcmRQcm90bztcbiIsImltcG9ydCBib2FyZFByb3RvIGZyb20gJy4vYm9hcmRQcm90by5qcyc7XG5cbnZhciBnYW1lID0gT2JqZWN0LmNyZWF0ZSh7XG4gIHVwZGF0ZVNjb3JlKCkge1xuICAgIHRoaXMuc2NvcmUgKz0gdGhpcy5uZXh0U2NvcmU7XG4gICAgc2NvcmVFbGVtZW50LmlubmVySFRNTCA9IHRoaXMuc2NvcmU7XG4gICAgdGhpcy5zcGVlZCAtPSAxO1xuICAgIHRoaXMubmV4dFNjb3JlICs9IDU7XG4gIH0sXG5cbiAgcmVzZXRTY29yZSgpIHtcbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgICBzY29yZUVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5zY29yZTtcbiAgfSxcblxuICBnYW1lT3ZlcigpIHtcbiAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xuICB9LFxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICB0aGlzLnJlc2V0U2NvcmUoKTtcblxuICAgIHRoaXMuYm9hcmQgPSBPYmplY3QuY3JlYXRlKGJvYXJkUHJvdG8pO1xuICAgIHRoaXMuYm9hcmQucm93cyA9IFtdO1xuICAgIHRoaXMuYm9hcmQubnVtUm93cyA9IDIwO1xuICAgIHRoaXMuYm9hcmQubnVtQ29scyA9IDIwO1xuICAgIHRoaXMuYm9hcmQuY3JlYXRlTWF0cml4KCk7XG5cbiAgICB0aGlzLmJvYXJkLmNyZWF0ZVNuYWtlKCk7XG4gICAgdGhpcy5ib2FyZC5hZGRGcnVpdCgpO1xuXG4gICAgdGhpcy5zY29yZSA9IDA7XG4gICAgdGhpcy5zcGVlZCA9IDEwMDtcbiAgICB0aGlzLmxhc3RUaWNrID0gMDtcbiAgICB0aGlzLm5leHRTY29yZSA9IDEwO1xuXG4gICAgdGhpcy5pc0dhbWVPdmVyID0gZmFsc2U7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShydW4pO1xuICB9LFxuXG4gIHJ1bih0aW1lc3RhbXApIHtcblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocnVuKTtcblxuICAgIGlmICh0aGlzLmlzR2FtZU92ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoKHRpbWVzdGFtcCAtIHRoaXMubGFzdFRpY2spIDwgdGhpcy5zcGVlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmxhc3RUaWNrID0gdGltZXN0YW1wO1xuXG4gICAgdGhpcy5ib2FyZC5kcmF3KCk7XG4gIH1cbn0pO1xuXG5leHBvcnRcbmRlZmF1bHQge1xuICBnYW1lLCBydW5cbn07XG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xuaW1wb3J0IHNldHRpbmdzIGZyb20gJy4vc2V0dGluZ3MuanMnO1xuXG52YXIgYm9hcmRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvYXJkJyk7XG52YXIgc2NvcmVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlJyk7XG5cbnZhciBzbmFrZSA9IGdhbWUuYm9hcmQuc25ha2UsXG4gIGtleWNvZGVzID0gc2V0dGluZ3Mua2V5Y29kZXMsXG4gIGRpcmVjdGlvbnMgPSBzZXR0aW5ncy5kaXJlY3Rpb25zO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IGtleWNvZGVzLlVQICYmIHNuYWtlLmRpcmVjdGlvbiAhPT0gZGlyZWN0aW9ucy5ET1dOKSB7XG4gICAgc25ha2UuZGlyZWN0aW9uID0gZGlyZWN0aW9ucy5VUDtcbiAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSBrZXljb2Rlcy5ET1dOICYmIHNuYWtlLmRpcmVjdGlvbiAhPT0gZGlyZWN0aW9ucy5VUCkge1xuICAgIHNuYWtlLmRpcmVjdGlvbiA9IGRpcmVjdGlvbnMuRE9XTjtcbiAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSBrZXljb2Rlcy5SSUdIVCAmJiBzbmFrZS5kaXJlY3Rpb24gIT09IGRpcmVjdGlvbnMuTEVGVCkge1xuICAgIHNuYWtlLmRpcmVjdGlvbiA9IGRpcmVjdGlvbnMuUklHSFQ7XG4gIH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0ga2V5Y29kZXMuTEVGVCAmJiBzbmFrZS5kaXJlY3Rpb24gIT09IGRpcmVjdGlvbnMuUklHSFQpIHtcbiAgICBzbmFrZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb25zLkxFRlQ7XG4gIH1cblxuICBpZiAoZXZlbnQua2V5Q29kZSA9PT0ga2V5Y29kZXMuU1BBQ0UpIHtcbiAgICBnYW1lLnN0YXJ0KCk7XG4gIH1cbn0pO1xuXG5nYW1lLnN0YXJ0KCk7XG5cbmV4cG9ydFxuZGVmYXVsdCB7XG4gIGJvYXJkRWxlbWVudCwgc2NvcmVFbGVtZW50XG59O1xuIiwidmFyIGRpcmVjdGlvbnMgPSB7XG5cdFVQOiAxLFxuXHRET1dOOiAyLFxuXHRMRUZUOiA0LFxuXHRSSUdIVDogOFxufTtcblxudmFyIGtleWNvZGVzID0ge1xuXHRVUDogMzgsXG5cdERPV046IDQwLFxuXHRSSUdIVDogMzksXG5cdExFRlQ6IDM3LFxuXHRTUEFDRTogMzJcbn07XG5cbmV4cG9ydFxuZGVmYXVsdCB7XG5cdGRpcmVjdGlvbnMsXG5cdGtleWNvZGVzXG59O1xuIiwidmFyIGJvZHlQcm90byA9IHt9O1xuXG52YXIgc25ha2VQcm90byA9IHtcbiAgZ2V0TGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmJvZHlQYXJ0cy5sZW5ndGg7XG4gIH0sXG5cbiAgZ2V0SGVhZCgpIHtcbiAgICByZXR1cm4gdGhpcy5ib2R5UGFydHNbMF07XG4gIH0sXG5cbiAgZ2V0VGFpbCgpIHtcbiAgICByZXR1cm4gdGhpcy5ib2R5UGFydHNbdGhpcy5ib2R5UGFydHMubGVuZ3RoIC0gMV07XG4gIH0sXG59O1xuXG5leHBvcnRcbmRlZmF1bHQgc25ha2VQcm90bztcbiIsImltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZS5qcyc7XG5cbnZhciB0aWxlUHJvdG8gPSB7XG4gIHBhaW50U25ha2VQYXJ0KCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdvbicpO1xuICAgIGlmICh0aGlzLm9jY3VwaWVkQnkuaXNIZWFkKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGVhZCcpO1xuICAgIH1cbiAgfSxcblxuICBjbGVhclRpbGUoKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ29uJywgJ2hlYWQnKTtcbiAgfSxcblxuICBhZGRTbmFrZVBhcnQoc25ha2VQYXJ0KSB7XG4gICAgaWYgKHRoaXMuaGFzRnJ1aXQpIHtcbiAgICAgIHRoaXMucmVtb3ZlRnJ1aXQoKTtcbiAgICAgIGdhbWUudXBkYXRlU2NvcmUoKTtcbiAgICAgIHZhciBib2R5ID0gT2JqZWN0LmNyZWF0ZShib2R5UHJvdG8pO1xuICAgICAgdmFyIHRhaWxUaWxlID0gZ2FtZS5zbmFrZS5ib2R5UGFydHNbc25ha2UuYm9keVBhcnRzLmxlbmd0aCAtIDFdLnRpbGU7XG4gICAgICBib2R5LnRpbGUgPSB0YWlsVGlsZS5hZGRTbmFrZVBhcnQoYm9keSk7XG4gICAgICBnYW1lLnNuYWtlLmJvZHlQYXJ0cy5wdXNoKGJvZHkpO1xuICAgICAgYm9hcmQuYWRkRnJ1aXQoKTtcbiAgICB9IGVsc2UgaWYgKHNuYWtlUGFydC5pc0hlYWQgJiYgdGhpcy5vY2N1cGllZEJ5KSB7XG4gICAgICBnYW1lLmdhbWVPdmVyKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMub2NjdXBpZWRCeSA9IHNuYWtlUGFydDtcbiAgICBzbmFrZVBhcnQudGlsZSA9IHRoaXM7XG4gICAgdGhpcy5wYWludFNuYWtlUGFydCgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbW92ZVNuYWtlUGFydCgpIHtcbiAgICB0aGlzLm9jY3VwaWVkQnkgPSBudWxsO1xuICAgIHRoaXMuY2xlYXJUaWxlKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgaGFzU25ha2VQYXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm9jY3VwaWVkQnkgIT0gbnVsbDtcbiAgfSxcblxuICBhZGRGcnVpdCgpIHtcbiAgICB0aGlzLmhhc0ZydWl0ID0gdHJ1ZTtcbiAgICB0aGlzLnBhaW50RnJ1aXQoKTtcbiAgfSxcblxuICByZW1vdmVGcnVpdCgpIHtcbiAgICB0aGlzLmhhc0ZydWl0ID0gZmFsc2U7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZydWl0Jyk7XG4gIH0sXG5cbiAgcGFpbnRGcnVpdCgpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZnJ1aXQnKTtcbiAgfVxufTtcblxuZXhwb3J0XG5kZWZhdWx0IHRpbGVQcm90bztcbiJdfQ==
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Setup = require("./controllers/Setup");

document.getElementById('startButton').addEventListener('click', function () {
  this.style.display = 'none';
  Setup();
});
//Setup();

},{"./controllers/Setup":7}],2:[function(require,module,exports){
"use strict";

var Location = require("../models/Location");
var Piece = require("../models/Piece");
var View = require("./View");

var Board = module.exports = {
  state: [],
  off: new Location("off", -1, -1),
  dummyPiece: new Piece({}, {}, true),
  turnCounter: 0,
  capture: function capture(piece) {
    View.removePiece(piece.domElement);
  },
  setLocation: function setLocation(piece, location) {
    var updateTurn = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    piece.location = location;
    Board.updateView(location, piece);

    if (updateTurn) {
      var turn = piece.owner.id === 1 ? ++Board.turnCounter : Board.turnCounter;
      var Game = require("./Game");

      View.updateTurn(turn, piece);
      piece.owner.otherPlayer.isTurnPlayer = true;
      Game.checkForCheckmate(piece.owner.otherPlayer);
    }

    return true;
  },
  makeState: function makeState() {
    var columns = [];
    for (var i = 0; i < 8; i++) {
      var row = [];
      for (var j = 0; j < 8; j++) {
        var alphabet = "abcdefgh";
        var name = alphabet.charAt(i) + (j + 1).toString();
        row.push(new Location(name, j, i, Board.dummyPiece));
      }
      columns.push(row);
    }
    Board.state = columns;
  },
  makeView: function makeView() {
    View.makeView();
  },
  traverse: function traverse(location, distance, direction) {
    var column = location.column,
        row = location.row;
    switch (direction) {
      case "north":
        return Board.state[column][row + distance];
        break;
      case "south":
        return Board.state[column][row - distance];
        break;
      case "east":
        return Board.state[column + distance][row];
        break;
      case "west":
        return Board.state[column - distance][row];
        break;
      case "northeast":
        return Board.state[column + distance][row + distance];
        break;
      case "northwest":
        return Board.state[column - distance][row + distance];
        break;
      case "southeast":
        return Board.state[column + distance][row - distance];
        break;
      case "southwest":
        return Board.state[column - distance][row - distance];
        break;
    }
  },
  pathIsOccupied: function pathIsOccupied(startLocation, endLocation) {
    var direction = startLocation.getDirection(endLocation),
        offset = startLocation.offset(endLocation);
    for (var i = 1; i < offset; i++) {
      if (Board.traverse(startLocation, i, direction).isOccupied) return true;
    }
    return false;
  },
  updateView: function updateView(location, piece) {
    return typeof location === "undefined" ? View.updateView() : View.updateViewAt(location, piece);
  }

};

},{"../models/Location":12,"../models/Piece":14,"./Game":4,"./View":8}],3:[function(require,module,exports){
"use strict";

var Board = require("./Board");

var Direction = module.exports = {
  north: "north",
  south: "south",
  east: "east",
  west: "west",

  getCardinalDirection: function getCardinalDirection(location1, location2, orientation) {
    var orient = orientation === "horizontal" ? "column" : "row";
    var offset = location2[orient] - location1[orient];
    if (offset > 0) {
      return orientation === "horizontal" ? this.east : this.north;
    } else if (offset < 0) {
      return orientation === "horizontal" ? this.west : this.south;
    } else {
      return null;
    }
  },

  getDirection: function getDirection(location1, location2) {
    var nsOffset = location2.row - location1.row,
        ewOffset = location2.column - location1.column,
        direction = "";
    if (nsOffset > 0) direction += this.north;
    if (nsOffset < 0) direction += this.south;
    if (ewOffset > 0) direction += this.east;
    if (ewOffset < 0) direction += this.west;

    return direction;
  },

  reverse: function reverse(direction) {
    switch (direction) {
      case "north":
        return "south";
        break;
      case "south":
        return "north";
        break;
      case "east":
        return "west";
        break;
      case "west":
        return "east";
        break;
      case "northeast":
        return "southwest";
        break;
      case "northwest":
        return "southeast";
        break;
      case "southeast":
        return "northwest";
        break;
      case "southwest":
        return "northeast";
        break;
    }
  }
};

},{"./Board":2}],4:[function(require,module,exports){
"use strict";

var Board = require("./Board");
var Players = require("./Players");

var Game = module.exports = {
  moveWillPutOwnerInCheck: function moveWillPutOwnerInCheck(piece, location) {
    var formerOccupant = location.occupant;
    var formerLocation = piece.location;
    var opponent = piece.owner.otherPlayer;
    var checked = false;
    if (formerOccupant !== Board.dummyPiece) formerOccupant._location = Board.off;

    piece._location = location;
    location._occupant = piece;
    formerLocation._occupant = Board.dummyPiece;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = opponent.pieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _piece = _step.value;

        if (_piece.location !== Board.off && _piece.threateningCheck) {
          checked = true;
          break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    location._occupant = formerOccupant;
    piece._location = formerLocation;
    formerLocation._occupant = piece;

    if (formerOccupant !== null) formerOccupant._location = location;
    return checked;
  },
  checkForCheckmate: function checkForCheckmate(player) {
    if (this.moveWillPutOwnerInCheck(player.pieces[4], player.pieces[4].location)) {
      //player is checked
      var freeMove = false;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Board.state[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var row = _step2.value;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = row[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var location = _step3.value;
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = player.pieces[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var piece = _step4.value;

                  if (piece.location !== Board.off) {
                    if (piece.checkLocation(location).success) {
                      freeMove = true;
                    }
                  }
                }
              } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                  }
                } finally {
                  if (_didIteratorError4) {
                    throw _iteratorError4;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (!freeMove) {
        alert('Checkmate! Good day, sir!');
        document.getElementById('startButton').style.display = "block";
      }
    }
  },
  throwError: {
    illegalMove: function illegalMove() {
      return false;
    }, //console.log('illegal move!'),
    illegalCastle: function illegalCastle() {
      return false;
    } //console.log('illegal castle!')
  },
  debug: function debug() {
    //var Players = require("./Players");
    //var Pieces = require("./Pieces");
  }
};

},{"./Board":2,"./Players":6}],5:[function(require,module,exports){
"use strict";

var King = require("../models/King");
var Queen = require("../models/Queen");
var Rook = require("../models/Rook");
var Bishop = require("../models/Bishop");
var Knight = require("../models/Knight");
var Pawn = require("../models/Pawn");
var Piece = require("../models/Piece");
var Board = require("./Board");

var Pieces = module.exports = {
  King: King,
  Queen: Queen,
  Rook: Rook,
  Bishop: Bishop,
  Knight: Knight,
  Pawn: Pawn,
  makePieces: function makePieces(player) {
    var pieceArray = undefined;
    var rowIndex = player.id === 1 ? 0 : 7;
    var pawnIndex = player.id === 1 ? 1 : 6;

    pieceArray = [new Rook(Board.state[0][rowIndex], player), new Knight(Board.state[1][rowIndex], player), new Bishop(Board.state[2][rowIndex], player), new Queen(Board.state[3][rowIndex], player), new King(Board.state[4][rowIndex], player), new Bishop(Board.state[5][rowIndex], player), new Knight(Board.state[6][rowIndex], player), new Rook(Board.state[7][rowIndex], player)];

    for (var i = 0; i < 8; i++) {
      pieceArray.push(new Pawn(Board.state[i][pawnIndex], player));
    }

    return pieceArray;
  }
};

},{"../models/Bishop":9,"../models/King":10,"../models/Knight":11,"../models/Pawn":13,"../models/Piece":14,"../models/Queen":16,"../models/Rook":17,"./Board":2}],6:[function(require,module,exports){
"use strict";

var Pieces = require("./Pieces");
var Player = require("../models/Player");

var Players = module.exports = {
  none: {},
  reverse: function reverse(player) {
    return player.id === 1 ? Players.player2 : Players.player1;
  },
  makePlayers: function makePlayers() {
    var player1 = new Player(1, "south");
    var player2 = new Player(2, "north");

    player1.pieces = Pieces.makePieces(player1);
    player2.pieces = Pieces.makePieces(player2);

    Players.player1 = player1;
    Players.player2 = player2;
  }
};

},{"../models/Player":15,"./Pieces":5}],7:[function(require,module,exports){
"use strict";

var Board = require("./Board");
var Players = require("./Players");
var Game = require("./Game");

var Setup = module.exports = function () {
  Board.makeState();
  Board.makeView();
  Players.makePlayers();
  Players.player1.isTurnPlayer = true;
  Game.debug();
};

},{"./Board":2,"./Game":4,"./Players":6}],8:[function(require,module,exports){
"use strict";

var View = module.exports = {
  makeView: function makeView() {
    var _this = this;

    var Board = require('./Board');
    var pane = document.getElementById('pane');
    var board = document.createElement('div');

    pane.innerHTML = "";
    board.className = 'board';
    for (var i = 7; i > -1; i--) {
      var row = document.createElement('div');
      var evenOrOdd = i % 2 ? 'even' : 'odd';
      row.className = 'row ' + evenOrOdd;
      row.id = 'row-' + i.toString();

      var _loop = function _loop(j) {
        var square = document.createElement('div');
        var evenOrOdd = j % 2 ? 'even' : 'odd';
        square.className = 'square ' + evenOrOdd;
        square.id = 'square-' + i.toString() + '-' + j.toString();
        var boardState = Board.state[j][i];
        square.addEventListener('dragenter', function (e) {
          return _this.dragAndDrop.enter(e, boardState);
        }, false);
        square.addEventListener('dragleave', function (e) {
          return _this.dragAndDrop.leave(e, boardState);
        }, false);
        square.addEventListener('dragover', function (e) {
          return _this.dragAndDrop.over(e, boardState);
        }, false);
        square.addEventListener('drop', function (e) {
          return _this.dragAndDrop.drop(e, boardState);
        }, false);
        boardState.domElement = square;
        row.appendChild(square);
      };

      for (var j = 0; j < 8; j++) {
        _loop(j);
      }
      board.appendChild(row);
    }
    pane.appendChild(board);

    var notation = document.createElement('div');
    notation.id = 'notation';
    pane.appendChild(notation);
  },
  putPieceOnBoard: function putPieceOnBoard(piece, location) {
    var _this2 = this;

    var View = this;
    var square = location.domElement;
    piece.domElement.setAttribute('draggable', 'true');
    square.appendChild(piece.domElement);

    piece.domElement.addEventListener('dragstart', function (e) {
      return _this2.dragAndDrop.start(e, piece);
    }, false);
    piece.domElement.addEventListener('dragend', this.dragAndDrop.end, false);
  },
  removePiece: function removePiece(piece) {
    piece.parentNode.removeChild(piece);
  },
  updateTurn: function updateTurn(turn, piece) {
    var notationDiv = document.getElementById('notation'),
        notation = piece.notation + piece.justCaptured + piece.location.name;

    if (piece.castled) notation = piece.castled;
    if (piece.promoted) {
      notation = piece.promoted;
      piece.promoted = false;
    }
    if (piece.owner.id === 1) {
      notationDiv.innerHTML += turn + "." + notation + " ";
    } else if (turn % 3 !== 0) {
      notationDiv.innerHTML += notation + " ";
    } else {
      notationDiv.innerHTML += notation + "<br>";
    }
  },
  updateView: function updateView() {
    var Board = require('./Board');
  },
  updateViewAt: function updateViewAt(location, piece) {
    var Board = require('./Board');
    var square = location.domElement;
    square.appendChild(piece.domElement);
  },
  dragAndDrop: {
    piece: {},
    start: function start(e, piece) {
      View.dragAndDrop.piece = piece;
      window.setTimeout(function () {
        return e.target.style.opacity = "0.4";
      }, 0);
    },
    enter: function enter(e, location) {
      e.preventDefault();
      if (View.dragAndDrop.piece.location !== location) location.domElement.className += " active";
    },
    over: function over(e, location) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    leave: function leave(e, location) {
      e.preventDefault();
      if (View.dragAndDrop.piece.location !== location) location.domElement.className = location.domElement.className.replace(/ active/g, "");
    },
    drop: function drop(e, location) {
      var piece = View.dragAndDrop.piece;
      var square = e.target;
      piece.moveTo(location);
    },
    end: function end(e) {
      View.dragAndDrop.counter = 0;
      View.dragAndDrop.piece = {};
      e.target.style.opacity = "1";
      var active = document.querySelector('.active');
      if (active) active.className = active.className.replace(/active/g, "");
    }
  }
};

},{"./Board":2}],9:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Board = require("../controllers/Board");
var Game = require("../controllers/Game");
var Piece = require("./Piece");

module.exports = (function (_Piece) {
  _inherits(Bishop, _Piece);

  function Bishop(location, owner) {
    _classCallCheck(this, Bishop);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bishop).call(this, location, owner, false));

    _this.domElement.className = "piece bishop player" + _this.owner.id;
    _this.domElement.innerHTML = _this.owner.id === 1 ? "&#9815;" : "&#9821;";
    _this.notation = 'B';
    _this.checkLocation = function (location) {
      var moveSucceeded = false;
      if (!Game.moveWillPutOwnerInCheck(this, location) && this.location.isDiagonalTo(location) && !Board.pathIsOccupied(this.location, location) && location.occupant.owner !== this.owner && this.owner.isTurnPlayer) moveSucceeded = true;

      return {
        success: moveSucceeded,
        type: 1
      };
    };

    return _this;
  }

  _createClass(Bishop, [{
    key: "threateningCheck",
    get: function get() {
      var king = this.owner.otherPlayer.king;

      if (this.location.isDiagonalTo(king.location) && !Board.pathIsOccupied(this.location, king.location)) {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return Bishop;
})(Piece);

},{"../controllers/Board":2,"../controllers/Game":4,"./Piece":14}],10:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Board = require("../controllers/Board");
var Game = require("../controllers/Game");
var Piece = require("./Piece");
var Direction = require("../controllers/Direction");

module.exports = (function (_Piece) {
  _inherits(King, _Piece);

  function King(location, owner) {
    _classCallCheck(this, King);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(King).call(this, location, owner, false));

    _this.domElement.className = "piece king player" + _this.owner.id;
    _this.domElement.innerHTML = _this.owner.id === 1 ? "&#9812;" : "&#9818;";
    _this.notation = 'K';

    _this.checkLocation = function (location) {
      var moveSucceeded = false;
      var moveType = 1;
      if (!Game.moveWillPutOwnerInCheck(this, location) && location.occupant.owner !== this.owner && this.location.offset(location) === 1 && this.owner.isTurnPlayer) {
        moveSucceeded = true;
      } else if (this.location.offset(location) === 2 && (location.row === this.owner.id - 1 || location.row === this.owner.id + 5) && (location.column === 2 || location.column === 6) && this.owner.isTurnPlayer) {
        var Rook = require("./Rook");
        var direction = this.location.getDirection(location);
        var rook = direction === "west" ? Board.traverse(location, 2, direction).occupant : Board.traverse(location, 1, direction).occupant;
        if (rook instanceof Rook && !rook.hasMoved && !this.hasMoved && !Board.pathIsOccupied(this.location, rook.location) && !Game.moveWillPutOwnerInCheck(this, location) && !Game.moveWillPutOwnerInCheck(this, Board.traverse(this.location, 1, direction)) //so it can't move through check
        ) {
            moveSucceeded = true;
            moveType = 2;
          }
      }

      return {
        success: moveSucceeded,
        type: moveType
      };
    };

    _this.moveTo = function (location) {
      var tryMove = this.checkLocation(location);
      if (tryMove.success) {
        this.castled = false;
        this.owner.justMovedTwo = {
          didMove: false,
          piece: Board.dummyPiece
        };
        if (tryMove.type === 1) Board.setLocation(this, location);
        if (tryMove.type === 2) this.castle(location);
        this.hasMoved = true;
        return true;
      } else {
        Game.throwError.illegalMove();
        return false;
      }
    };

    _this.castle = function (location) {
      var direction = this.location.getDirection(location);
      var rook = direction === "west" ? Board.traverse(location, 2, direction).occupant : Board.traverse(location, 1, direction).occupant;
      rook.hasMoved = true;
      this.castled = direction === "west" ? '0-0-0' : '0-0';
      Board.setLocation(rook, Board.traverse(location, 1, Direction.reverse(direction)), false);
      return Board.setLocation(this, location);
    };

    return _this;
  }

  _createClass(King, [{
    key: "threateningCheck",
    get: function get() {
      return false;
    }
  }]);

  return King;
})(Piece);

},{"../controllers/Board":2,"../controllers/Direction":3,"../controllers/Game":4,"./Piece":14,"./Rook":17}],11:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Board = require("../controllers/Board");
var Game = require("../controllers/Game");
var Piece = require("./Piece");

module.exports = (function (_Piece) {
  _inherits(Knight, _Piece);

  function Knight(location, owner) {
    _classCallCheck(this, Knight);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Knight).call(this, location, owner, false));

    _this.domElement.className = "piece knight player" + _this.owner.id;
    _this.domElement.innerHTML = _this.owner.id === 1 ? "&#9816;" : "&#9822;";
    _this.notation = 'N';

    _this.checkLocation = function (location) {
      var moveSucceeded = false;
      if (!Game.moveWillPutOwnerInCheck(this, location) && location.occupant.owner !== this.owner && (this.location.offset.vertical(location) === 2 && this.location.offset.horizontal(location) === 1 || this.location.offset.vertical(location) === 1 && this.location.offset.horizontal(location) === 2) && this.owner.isTurnPlayer) moveSucceeded = true;

      return {
        success: moveSucceeded,
        type: 1
      };
    };

    return _this;
  }

  _createClass(Knight, [{
    key: "threateningCheck",
    get: function get() {
      var king = this.owner.otherPlayer.king;
      if (this.location.offset.vertical(king.location) === 2 && this.location.offset.horizontal(king.location) === 1 || this.location.offset.vertical(king.location) === 1 && this.location.offset.horizontal(king.location) === 2) {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return Knight;
})(Piece);

},{"../controllers/Board":2,"../controllers/Game":4,"./Piece":14}],12:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = (function () {
  function Location(name, row, column, occupant) {
    var _this = this;

    _classCallCheck(this, Location);

    var Board = require("../controllers/Board");
    var Direction = require("../controllers/Direction");

    this.name = name;
    this.row = row;
    this.column = column;
    this._occupant = occupant;

    this.offset = function (location) {
      var v = this.offset.vertical(location),
          h = this.offset.horizontal(location);
      if (v === h) {
        return v;
      } else {
        return v + h;
      }
    };

    this.offset.vertical = function (location) {
      return Math.abs(_this.row - location.row);
    };

    this.offset.horizontal = function (location) {
      return Math.abs(_this.column - location.column);
    };

    this.isDiagonalTo = function (location) {
      return _this.offset.vertical(location) === _this.offset.horizontal(location);
    };

    this.isCardinalTo = function (location) {
      return _this.offset.vertical(location) === 0 || _this.offset.horizontal(location) === 0;
    };

    this.getDirection = function (location) {
      return Direction.getDirection(_this, location);
    };

    this.getCardinalDirection = function (location, orientation) {
      return Direction.getCardinalDirection(_this, location, orientation);
    };
  }

  _createClass(Location, [{
    key: "isOccupied",
    get: function get() {
      var Board = require("../controllers/Board");
      return this.occupant !== Board.dummyPiece;
    }
  }, {
    key: "occupant",
    set: function set(piece) {
      this._occupant = piece;
      piece._location = this;
    },
    get: function get() {
      return this._occupant;
    }
  }]);

  return Location;
})();

},{"../controllers/Board":2,"../controllers/Direction":3}],13:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Game = require("../controllers/Game");
var Board = require("../controllers/Board");
var Players = require("../controllers/Players");
var Piece = require("./Piece");

module.exports = (function (_Piece) {
  _inherits(Pawn, _Piece);

  function Pawn(location, owner) {
    _classCallCheck(this, Pawn);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pawn).call(this, location, owner, false));

    _this.domElement.className = "piece pawn player" + _this.owner.id;
    _this.domElement.innerHTML = _this.owner.id === 1 ? "&#9817;" : "&#9823;";
    _this.notation = '';

    _this.checkLocation = function (location) {
      var offset = this.location.offset(location),
          moveSucceeded = false,
          moveType = 0;
      if (!Game.moveWillPutOwnerInCheck(this, location) && this.location.getCardinalDirection(location) === this.owner.otherPlayer.home && offset < 3 && this.owner.isTurnPlayer) {
        if (this.location.offset.horizontal(location) === 0) {
          if (offset === 1 && !location.isOccupied) {
            //move one forward
            moveSucceeded = true;
            moveType = 1;
          } else if ( //move two forward
          offset === 2 && !location.isOccupied && !Board.pathIsOccupied(this.location, location) && this.hasMoved === false) {
            moveSucceeded = true;
            moveType = 3;
          }
        } else if (offset === 1) {
          if (location.isOccupied && location.occupant.owner !== this.owner) {
            //capture
            moveSucceeded = true;
            moveType = 1;
          } else if (!location.isOccupied && this.owner.otherPlayer.justMovedTwo.didMove) {
            //en passant
            if (this.owner.otherPlayer.justMovedTwo.piece === Board.traverse(location, 1, this.owner.home).occupant) {
              moveSucceeded = true;
              moveType = 2;
            }
          }
        }
      }

      if (moveSucceeded && (location.row === 7 || location.row === 0)) {
        //promotion
        moveType = 4;
      }

      return {
        success: moveSucceeded,
        type: moveType
      };
    };

    _this.moveTo = function (location) {
      var tryMove = this.checkLocation(location);
      if (tryMove.success) {
        this.enPassant = false;

        this.owner.justMovedTwo = {
          didMove: false,
          piece: Board.dummyPiece
        };

        if (tryMove.type === 2) {
          var oppOccupant = Board.traverse(location, 1, this.owner.home).occupant;
          this.enPassant = true;
          oppOccupant.location.occupant = Board.dummyPiece;
          oppOccupant.capture();
        }

        if (tryMove.type === 3) {
          this.owner.justMovedTwo = {
            didMove: true,
            piece: this
          };
        }

        if (tryMove.type === 4) {
          return this.promote(location);
        }

        this.hasMoved = true;
        return Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
        return false;
      }
    };

    _this.promote = function (location) {
      var pieceType = prompt('Which piece do you want? Answers are "Queen" "Bishop" "Knight", "Rook" without quotes');

      switch (pieceType) {
        case "Queen":
          break;
        case "Bishop":
          break;
        case "Knight":
          break;
        case "Rook":
          break;
        default:
          this.promote(location);return false;
      }

      var pieces = require("../controllers/Pieces");
      var piece = new pieces[pieceType](this.location, this.owner);
      var oldLocation = '';
      for (var index in this.owner.pieces) {
        if (this.owner.pieces[index] === this) {
          oldLocation = this.location.name;
          this.owner.pieces[index] = piece;
          this.capture();
        }
      }
      piece.hasMoved = true;
      if (location.occupant !== Board.dummyPiece) {
        piece.promoted = oldLocation[0] + 'x' + location.name + piece.notation;
      } else {
        piece.promoted = location.name + piece.notation;
      }
      Board.setLocation(piece, location);
      return true;
    };
    return _this;
  }

  _createClass(Pawn, [{
    key: "threateningCheck",
    get: function get() {
      var king = this.owner.otherPlayer.king;
      return (this.location.getDirection(king.location) === this.owner.otherPlayer.home + "west" || this.location.getDirection(king.location) === this.owner.otherPlayer.home + "east") && this.location.offset.vertical(king.location) === 1 && this.location.offset.horizontal(king.location) === 1;
    }
  }]);

  return Pawn;
})(Piece);

},{"../controllers/Board":2,"../controllers/Game":4,"../controllers/Pieces":5,"../controllers/Players":6,"./Piece":14}],14:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = require("../controllers/Board");
var View = require("../controllers/View");

module.exports = (function () {
  function Piece(location, owner, isDummyPiece) {
    _classCallCheck(this, Piece);

    this._location = location;
    this.owner = owner;
    this.hasMoved = false;
    this.isCaptured = false;
    this.enPassant = false;
    this.promoted = false;
    this.justCaptured = '';
    location.occupant = this;
    if (!isDummyPiece) {
      var idString = "pieceInit-" + location.column.toString() + "-" + location.row.toString();
      this.domElement = document.createElement('div');
      View.putPieceOnBoard(this, location);
    }

    this.moveTo = function (location) {
      var Board = require("../controllers/Board");
      if (this.checkLocation(location).success) {
        this.hasMoved = true;
        this.owner.justMovedTwo = {
          didMove: false,
          piece: Board.dummyPiece
        };
        return Board.setLocation(this, location);
      } else {
        var Game = require("../controllers/Game");
        Game.throwError.illegalMove();
        return false;
      }
    };

    this.capture = function () {
      var Board = require("../controllers/Board");
      this._location = Board.off;
      this.isCaptured = true;
      Board.capture(this);
    };
  }

  _createClass(Piece, [{
    key: "location",
    set: function set(location) {
      var Pawn = require("./Pawn");
      var Board = require("../controllers/Board");
      var oldLocation = this instanceof Pawn ? this.location.name[0] : '';
      this._location._occupant = Board.dummyPiece;
      this.justCaptured = '';
      if (location.occupant !== Board.dummyPiece) {
        location.occupant.capture();
        this.justCaptured = oldLocation + 'x';
      } else if (this.enPassant) {
        this.justCaptured = oldLocation + 'x';
      }
      this._location = location;
      location._occupant = this;
    },
    get: function get() {
      return this._location;
    }
  }]);

  return Piece;
})();

},{"../controllers/Board":2,"../controllers/Game":4,"../controllers/View":8,"./Pawn":13}],15:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = (function () {
  function Player(id, home) {
    _classCallCheck(this, Player);

    this.id = id;
    this.home = home;
    this.pieces = [];
    this._isTurnPlayer = false;

    this.filterPieces = function (pieceType) {
      var pieceArray = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.pieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var piece = _step.value;

          if (piece instanceof pieceType) pieceArray.push(piece);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return pieceArray;
    };
  }

  _createClass(Player, [{
    key: "king",
    get: function get() {
      return this.pieces[4];
    }
  }, {
    key: "otherPlayer",
    get: function get() {
      var Players = require("../controllers/Players");
      return Players.reverse(this);
    }
  }, {
    key: "isTurnPlayer",
    get: function get() {
      return this._isTurnPlayer;
    },
    set: function set(b) {
      this._isTurnPlayer = true;
      this.otherPlayer._isTurnPlayer = false;
    }
  }]);

  return Player;
})();

},{"../controllers/Players":6}],16:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Board = require("../controllers/Board");
var Game = require("../controllers/Game");
var Piece = require("./Piece");

module.exports = (function (_Piece) {
  _inherits(Queen, _Piece);

  function Queen(location, owner) {
    _classCallCheck(this, Queen);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Queen).call(this, location, owner, false));

    _this.domElement.className = "piece queen player" + _this.owner.id;
    _this.domElement.innerHTML = _this.owner.id === 1 ? "&#9813;" : "&#9819;";
    _this.notation = 'Q';

    _this.checkLocation = function (location) {
      var moveSucceeded = false;
      if (!Game.moveWillPutOwnerInCheck(this, location) && (this.location.isDiagonalTo(location) || this.location.isCardinalTo(location)) && !Board.pathIsOccupied(this.location, location) && location.occupant.owner !== this.owner && this.owner.isTurnPlayer) moveSucceeded = true;

      return {
        success: moveSucceeded,
        type: 1
      };
    };

    return _this;
  }

  _createClass(Queen, [{
    key: "threateningCheck",
    get: function get() {
      var king = this.owner.otherPlayer.king;
      return (this.location.isDiagonalTo(king.location) || this.location.isCardinalTo(king.location)) && !Board.pathIsOccupied(this.location, king.location);
    }
  }]);

  return Queen;
})(Piece);

},{"../controllers/Board":2,"../controllers/Game":4,"./Piece":14}],17:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Board = require("../controllers/Board");
var Game = require("../controllers/Game");
var Piece = require("./Piece");

module.exports = (function (_Piece) {
  _inherits(Rook, _Piece);

  function Rook(location, owner) {
    _classCallCheck(this, Rook);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Rook).call(this, location, owner, false));

    _this.domElement.className = "piece rook player" + _this.owner.id;
    _this.domElement.innerHTML = _this.owner.id === 1 ? "&#9814;" : "&#9820;";
    _this.notation = 'R';

    _this.checkLocation = function (location) {
      var moveSucceeded = false;
      if (!Game.moveWillPutOwnerInCheck(this, location) && this.location.isCardinalTo(location) && !Board.pathIsOccupied(this.location, location) && location.occupant.owner !== this.owner && this.owner.isTurnPlayer) moveSucceeded = true;

      return {
        success: moveSucceeded,
        type: 1
      };
    };

    return _this;
  }

  _createClass(Rook, [{
    key: "threateningCheck",
    get: function get() {
      var king = this.owner.otherPlayer.king;
      return this.location.isCardinalTo(king.location) && !Board.pathIsOccupied(this.location, king.location);
    }
  }]);

  return Rook;
})(Piece);

},{"../controllers/Board":2,"../controllers/Game":4,"./Piece":14}]},{},[1]);

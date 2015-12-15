(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Setup = require("./controllers/Setup");

Setup();

},{"./controllers/Setup":7}],2:[function(require,module,exports){
"use strict";

var Location = require("../models/Location");
var Piece = require("../models/Piece");

var Board = module.exports = {
  state: [],
  off: new Location("off", -1, -1),
  dummyPiece: new Piece({}, {}),
  setLocation: function setLocation(piece, location) {
    piece.location.occupant = Board.dummyPiece;
    piece.location = location;
    if (location.occupant !== Board.dummyPiece) {
      location.occupant.location = Board.off;
    }
    location.occupant = piece;
    Board.updateView();
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
  updateView: function updateView() {},
  moveWillPutOwnerInCheck: function moveWillPutOwnerInCheck(piece, location) {
    var formerOccupant = location.occupant;
    var formerLocation = piece.location;
    var opponent = piece.owner.otherPlayer;
    var checked = false;

    if (formerOccupant !== null) formerOccupant.location = Board.off;

    piece.location = location;
    location.occupant = piece;

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

    location.occupant = formerOccupant;
    piece.location = formerLocation;
    if (formerOccupant !== null) formerOccupant.location = location;
    return checked;
  }

};

},{"../models/Location":11,"../models/Piece":13}],3:[function(require,module,exports){
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

    if (formerOccupant !== null) formerOccupant.location = Board.off;

    piece.location = location;
    location.occupant = piece;

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

    location.occupant = formerOccupant;
    piece.location = formerLocation;
    if (formerOccupant !== null) formerOccupant.location = location;
    return checked;
  },
  throwError: {
    illegalMove: function illegalMove() {
      console.log('illegal move!');
    }
  },
  debug: function debug() {
    var Players = require("./Players");
    var Pieces = require("./Pieces");
    Players.player1.pieces[1].moveTo(Board.state[0][2]);
    Players.player1.pieces[1].moveTo(Board.state[1][4]);
    Players.player1.pieces[1].moveTo(Board.state[2][6]);
    console.log(Players.player1.pieces[1].threateningCheck);
  }
};

},{"./Board":2,"./Pieces":5,"./Players":6}],5:[function(require,module,exports){
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

},{"../models/Bishop":8,"../models/King":9,"../models/Knight":10,"../models/Pawn":12,"../models/Piece":13,"../models/Queen":15,"../models/Rook":16,"./Board":2}],6:[function(require,module,exports){
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

},{"../models/Player":14,"./Pieces":5}],7:[function(require,module,exports){
"use strict";

var Board = require("./Board");
var Players = require("./Players");
var Game = require("./Game");

var Setup = module.exports = function () {
  Board.makeState();
  Players.makePlayers();
  Game.debug();
};

},{"./Board":2,"./Game":4,"./Players":6}],8:[function(require,module,exports){
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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bishop).call(this, location, owner));

    _this.moveTo = function (location) {
      if (!Game.moveWillPutOwnerInCheck(this, location) && this.location.isDiagonalTo(location) && !Board.pathIsOccupied(this.location, location) && location.occupant.owner !== this.owner) {
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      }
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

},{"../controllers/Board":2,"../controllers/Game":4,"./Piece":13}],9:[function(require,module,exports){
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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(King).call(this, location, owner));

    _this.moveTo = function (location) {
      if (!Game.moveWillPutOwnerInCheck(this, location) && location.occupant.owner !== this.owner && this.location.offset(location) === 1) {
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      }
    };

    _this.castle = function (rook) {
      var direction = this.location.getCardinalDirection(rook.location, "horizontal"),
          location = Board.traverse(this.location, 2, direction);
      if (!rook.hasMoved && !this.hasMoved && !Board.pathIsOccupied(this.location, rook.location) && !Game.moveWillPutOwnerInCheck(this, location) && !Game.moveWillPutOwnerInCheck(this, Board.traverse(this.location, 1, direction)) //so it can't move through check
      ) {
          Board.setLocation(this, location, false);
          Board.setLocation(rook, Board.traverse(location, 1, Direction.reverse(direction)));
        } else {
        Game.throwError.illegalMove();
      }
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

},{"../controllers/Board":2,"../controllers/Direction":3,"../controllers/Game":4,"./Piece":13}],10:[function(require,module,exports){
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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Knight).call(this, location, owner));

    _this.moveTo = function (location) {
      if (!Board.moveWillPutOwnerInCheck(this, location) && location.occupant.owner !== this.owner && (this.location.offset.vertical(location) === 2 && this.location.offset.horizontal(location) === 1 || this.location.offset.vertical(location) === 1 && this.location.offset.horizontal(location) === 2)) {
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      }
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

},{"../controllers/Board":2,"../controllers/Game":4,"./Piece":13}],11:[function(require,module,exports){
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
    this.occupant = occupant;

    this.offset = function (location) {
      return this.offset.vertical(location) || this.offset.horizontal(location);
    };

    this.offset.vertical = function (location) {
      return Math.abs(_this.row - location.row);
    };

    this.offset.horizontal = function (location) {
      return Math.abs(_this.column - location.column);
    };

    this.isDiagonalTo = function (location) {
      return this.offset.vertical(location) === this.offset.horizontal(location);
    };

    this.isCardinalTo = function (location) {
      return this.offset.vertical(location) === 0 || this.offset.horizontal(location) === 0;
    };

    this.getDirection = function (location) {
      return Direction.getDirection(this, location);
    };

    this.getCardinalDirection = function (location, orientation) {
      return Direction.getCardinalDirection(this, location, orientation);
    };
  }

  _createClass(Location, [{
    key: "isOccupied",
    get: function get() {
      var Board = require("../controllers/Board");
      return this.occupant !== Board.dummyPiece;
    }
  }]);

  return Location;
})();

},{"../controllers/Board":2,"../controllers/Direction":3}],12:[function(require,module,exports){
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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pawn).call(this, location, owner));

    _this.moveTo = function (location) {
      var offset = this.location.offset(location);
      var moveSucceeded = false;
      if (!Game.moveWillPutOwnerInCheck(this, location) && this.location.getCardinalDirection(location) === this.owner.otherPlayer.home && offset < 3) {
        if (this.location.offset.horizontal(location) === 0) {
          if (offset === 1 && !location.isOccupied) {
            //move one forward
            this.hasMoved = true;
            Board.setLocation(this, location);
            moveSucceeded = true;
          } else if ( //move two forward
          offset === 2 && !location.isOccupied && !Board.pathIsOccupied(this.location, location) && this.hasMoved === false) {
            this.hasMoved = true;
            Board.setLocation(this, location);
            this.justMovedTwo = true;
            moveSucceeded = true;
          }
        } else if (offset === 1) {
          if (location.isOccupied && location.occupant.owner !== this.owner) {
            //capture
            this.hasMoved = true;
            Board.setLocation(this, location);
            moveSucceeded = true;
          } else if (!location.isOccupied && Board.traverse(location, 1, this.owner.home).occupant.justMovedTwo) {
            //en passant
            this.hasMoved = true;
            var oppOccupant = Board.traverse(location, 1, this.owner.home).occupant;
            oppOccupant.location.occupant = Board.dummyPiece; //hack to make sure piece gets captured
            location.occupant = oppOccupant; //hack to make sure piece gets captured
            Board.setLocation(this, location);
            console.log(oppOccupant);
            moveSucceeded = true;
          }
        }
      }

      if (!moveSucceeded) {
        Game.throwError.illegalMove();
      }
    };
    return _this;
  }

  _createClass(Pawn, [{
    key: "threateningCheck",
    get: function get() {
      var king = this.owner.otherPlayer.king;

      if ((this.location.getDirection(king.location) === this.owner.otherPlayer.home + "west" || this.location.getDirection(king.location) === this.owner.otherPlayer.home + "east") && this.location.offset(king.location) === 1) {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return Pawn;
})(Piece);

},{"../controllers/Board":2,"../controllers/Game":4,"../controllers/Players":6,"./Piece":13}],13:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = require("../controllers/Board");

module.exports = function Piece(location, owner) {
  _classCallCheck(this, Piece);

  this.location = location;
  this.owner = owner;
  this.hasMoved = false;
  location.occupant = this;
};

},{"../controllers/Board":2}],14:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = (function () {
  function Player(id, home) {
    _classCallCheck(this, Player);

    this.id = id;
    this.home = home;
    this.pieces = [];

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
  }]);

  return Player;
})();

},{"../controllers/Players":6}],15:[function(require,module,exports){
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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Queen).call(this, location, owner));

    _this.moveTo = function (location) {
      if (!Game.moveWillPutOwnerInCheck(this, location) && (this.location.isDiagonalTo(location) || this.location.isCardinalTo(location)) && !Board.pathIsOccupied(this.location, location) && location.occupant.owner !== this.owner) {
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      }
    };
    return _this;
  }

  _createClass(Queen, [{
    key: "threateningCheck",
    get: function get() {
      var king = this.owner.otherPlayer.king;

      if ((this.location.isDiagonalTo(king.location) || this.location.isCardinalTo(king.location)) && !Board.pathIsOccupied(this.location, king.location)) {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return Queen;
})(Piece);

},{"../controllers/Board":2,"../controllers/Game":4,"./Piece":13}],16:[function(require,module,exports){
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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Rook).call(this, location, owner));

    _this.moveTo = function (location) {
      if (!Game.moveWillPutOwnerInCheck(this, location) && this.location.isCardinalTo(location) && !Board.pathIsOccupied(this.location, location) && location.occupant.owner !== this.owner) {
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      }
    };
    return _this;
  }

  _createClass(Rook, [{
    key: "threateningCheck",
    get: function get() {

      var king = this.owner.otherPlayer.king;
      if (this.location.isCardinalTo(king.location) && !Board.pathIsOccupied(this.location, king.location)) {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return Rook;
})(Piece);

},{"../controllers/Board":2,"../controllers/Game":4,"./Piece":13}]},{},[1]);
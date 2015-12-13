"use strict";
var Location = require("./Location");
var Piece = require("./Piece");

var Board = module.exports = {
  state: [],
  off: new Location("off", -1, -1),
  dummyPiece: new Piece({}, {}),
  setLocation: function (piece, location) {
    piece.location.occupant = Board.dummyPiece;
    piece.location = location;
    if (location.occupant !== Board.dummyPiece) {
      location.occupant.location = Board.off;
    }
    location.occupant = piece;
    Board.updateView();
  },
  makeState: function () {
    let columns = [];
    for (let i = 0; i < 8; i++) {
      let row = [];
      for (let j = 0; j < 8; j++) {
        let alphabet = "abcdefgh";
        let name = alphabet.charAt(i) + (j+1).toString();
        row.push(new Location(name, j, i, Board.dummyPiece));
      }
      columns.push(row);
    }
    Board.state = columns;
  },
  traverse: function (location, distance, direction) {
    let column = location.column,
        row = location.row;
    switch (direction) {
      case "north": 
        return Board.state[column][row+distance];
        break;
      case "south":
        return Board.state[column][row-distance];
        break;
      case "east":
        return Board.state[column+distance][row];
        break;
      case "west":
        return Board.state[column-distance][row];
        break;
      case "northeast": 
        return Board.state[column+distance][row+distance];
        break;
      case "northwest":
        return Board.state[column-distance][row+distance];
        break;
      case "southeast":
        return Board.state[column+distance][row-distance];
        break;
      case "southwest":
        return Board.state[column-distance][row-distance];
        break;
    }
  },
  pathIsOccupied: function (startLocation, endLocation) {
    let direction = startLocation.getDirection(endLocation),
        offset = startLocation.offset(endLocation);
    for (let i = 1; i < offset; i++) {
      if (Board.traverse(startLocation, i, direction).isOccupied) return true;
    }
    return false;
  },
  updateView: function () {},
  moveWillPutOwnerInCheck: function (piece, location) {
    let formerOccupant = location.occupant;
    let formerLocation = piece.location;
    let opponent = piece.owner.otherPlayer; 
    let checked = false;
    
    if (formerOccupant !== null) formerOccupant.location = Board.off;
    
    piece.location = location;
    location.occupant = piece;
    
    for (let piece of opponent.pieces) {
      if (piece.location !== Board.off && piece.threateningCheck) {
        checked = true;
        break;
      }
    }

    location.occupant = formerOccupant;
    piece.location = formerLocation;
    if (formerOccupant !== null) formerOccupant.location = location;
    return checked;
  }

};
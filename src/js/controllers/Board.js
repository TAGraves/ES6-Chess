"use strict";
var Location = require("../models/Location");
var Piece = require("../models/Piece");
var View = require("./View");

var Board = module.exports = {
  state: [],
  off: new Location("off", -1, -1),
  dummyPiece: new Piece({}, {}, true),
  capture: function (piece) {
    View.removePiece(piece.domElement);
  },
  setLocation: function (piece, location) {
    piece.location = location;
    Board.updateView(location, piece);
    return true;
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
  makeView: function () {
    View.makeView();
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
  updateView: (location, piece) => (typeof location === "undefined") ? View.updateView() : View.updateViewAt(location, piece),
  moveWillPutOwnerInCheck: function (piece, location) {
    let formerOccupant = location.occupant;
    let formerLocation = piece.location;
    let opponent = piece.owner.otherPlayer; 
    let checked = false;
    
    if (formerOccupant !== null) formerOccupant._location = Board.off;
    
    piece._location = location;
    location._occupant = piece;
    
    for (let piece of opponent.pieces) {
      if (piece.location !== Board.off && piece.threateningCheck) {
        checked = true;
        break;
      }
    }

    location._occupant = formerOccupant;
    piece._location = formerLocation;
    if (formerOccupant !== null) formerOccupant._location = location;
    return checked;
  }

};
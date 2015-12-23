"use strict";

var Board = require("./Board");
var Players = require("./Players");

var Game = module.exports = {
  moveWillPutOwnerInCheck: function (piece, location) {
    let formerOccupant = location.occupant;
    let formerLocation = piece.location;
    let opponent = piece.owner.otherPlayer; 
    let checked = false;
    if (formerOccupant !== Board.dummyPiece) formerOccupant._location = Board.off;
    
    piece._location = location;
    location._occupant = piece;    
    formerLocation._occupant = Board.dummyPiece;
    
    for (let piece of opponent.pieces) {
      if (piece.location !== Board.off && piece.threateningCheck) {
        checked = true;
        break;
      }
    }

    location._occupant = formerOccupant;
    piece._location = formerLocation;
    formerLocation._occupant = piece;

    if (formerOccupant !== null) formerOccupant._location = location;
    return checked;
  },
  throwError: {
    illegalMove: () => console.log('illegal move!'),
    illegalCastle: () => console.log('illegal castle!')
  },
  debug: function () {
    var Players = require("./Players");
    var Pieces = require("./Pieces");
  }
};
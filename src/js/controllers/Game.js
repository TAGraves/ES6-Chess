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
    Players.player1.pieces[11].moveTo(Board.state[3][3]);
    Players.player1.pieces[11].moveTo(Board.state[3][4]);
    Players.player1.pieces[11].moveTo(Board.state[3][5]);
    Players.player1.pieces[11].moveTo(Board.state[4][6]);
    Players.player1.pieces[2].moveTo(Board.state[4][2]);
    Players.player1.pieces[3].moveTo(Board.state[3][1]);
    Players.player1.pieces[1].moveTo(Board.state[0][2]);
    Players.player1.pieces[4].moveTo(Board.state[2][0]);
  }
};
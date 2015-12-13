"use strict";

var Board = require("./Board");
var Players = require("./Players");

var Game = module.exports = {
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
  },
  throwError: {
    illegalMove: function () {
      console.log('illegal move!');
    }
  },
  debug: function () {
    var Players = require("./Players");
    var Pieces = require("./Pieces");
    Players.player1.pieces[8].moveTo(Board.state[0][3]);
    Players.player1.pieces[8].moveTo(Board.state[0][4]);
    Players.player2.pieces[9].moveTo(Board.state[1][4]);
    Players.player1.pieces[8].moveTo(Board.state[1][5]);
    console.log(Board.state);
    console.log(Players.player1.pieces);
    console.log(Players.player2.pieces);
  }
};
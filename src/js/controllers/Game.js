"use strict";

var Board = require("./Board");
var Players = require("./Players");

var Game = module.exports = {
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
  },
  throwError: {
    illegalMove: function () {
      console.log('illegal move!');
    }
  },
  debug: function () {
    var Players = require("./Players");
    var Pieces = require("./Pieces");
    Players.player1.pieces[1].moveTo(Board.state[0][2]);
    Players.player1.pieces[1].moveTo(Board.state[1][4]);
    Players.player1.pieces[1].moveTo(Board.state[2][6]);
    console.log(Players.player1.pieces[1].threateningCheck);
  }
};
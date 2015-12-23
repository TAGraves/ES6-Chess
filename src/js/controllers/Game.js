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
  checkForCheckmate: function (player) {
    if (this.moveWillPutOwnerInCheck(player.pieces[4], player.pieces[4].location)) {
      //player is checked
      let freeMove = false;
      for (let row of Board.state) {
        for (let location of row) {
          for (let piece of player.pieces) {
            if (piece.location !== Board.off) {
              if (piece.checkLocation(location).success) {
                freeMove = true;
              }
            }
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
    illegalMove: () => false,//console.log('illegal move!'),
    illegalCastle: () => false//console.log('illegal castle!')
  },
  debug: function () {
    //var Players = require("./Players");
    //var Pieces = require("./Pieces");
  }
};
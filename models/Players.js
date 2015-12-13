"use strict";

var Pieces = require("./Pieces");

class Player {
  constructor(id, home) {
    this.id = id;
    this.home = home;
    this.pieces = [];
    
    this.filterPieces = function (pieceType) {
      let pieceArray = [];
      for (let piece of this.pieces) {
        if (piece instanceof pieceType) pieceArray.push(piece);
      }
      return pieceArray;
    };
  }
  
  get king() {
    return this.pieces[4];
  }
  
  get otherPlayer() {
    return Players.reverse(this);
  }
}

var Players = module.exports = {
  none: {},
  reverse: function (player) {
    return (player.id === 1) ? Players.player2 : Players.player1;
  },
  makePlayers: function () {
    let player1 = new Player(1, "south");
    let player2 = new Player(2, "north");
    
    player1.pieces = Pieces.makePieces(player1);
    player2.pieces = Pieces.makePieces(player2);
    
    Players.player1 = player1;
    Players.player2 = player2;
  }
};
"use strict";

var Pieces = require("./Pieces");

class Player {
  constructor(id, home) {
    this.id = id;
    this.home = home;
    this.pieces = [];
  }
  
  get otherPlayer() {
    return Players.otherPlayer(this);
  }
}

var Players = module.exports = {
  none: {},
  otherPlayer: function (player) {
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
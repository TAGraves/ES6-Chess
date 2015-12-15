"use strict";

var Pieces = require("./Pieces");
var Player = require("../models/Player");

var Players = module.exports = {
  none: {},
  reverse: (player) => (player.id === 1) ? Players.player2 : Players.player1,
  makePlayers: function () {
    let player1 = new Player(1, "south");
    let player2 = new Player(2, "north");
    
    player1.pieces = Pieces.makePieces(player1);
    player2.pieces = Pieces.makePieces(player2);
    
    Players.player1 = player1;
    Players.player2 = player2;
  }
};
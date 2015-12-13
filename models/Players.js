"use strict";

class Player {
  constructor(id, home) {
    this.id = id,
    home = "";
  }
}

var Players = module.exports = {
  none: {},
  player1: new Player(1, "south"),
  player2: new Player(2, "north"),
  otherPlayer: function (player) {
    return (player.id === 1) ? Players.player2 : Players.player1;
  }
};
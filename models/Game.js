"use strict";

var Setup = require("./Setup");
var Board = require("./Board");
var Players = require("./Players");

var Game = module.exports = {
  beginGame: function () {
    Setup();
    Game.debug();
  },
  moveWillPutOwnerInCheck: function (piece, location) {},
  throwError: {
    illegalMove: function () {}
  },
  debug: function () {
    console.log(Board.state, Players.player2);
  }
};
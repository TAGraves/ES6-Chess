"use strict";

var Board = require("./Board");
var Players = require("./Players");
var Game = require("./Game");

var Setup = module.exports = function () {
  Board.makeState();
  Board.makeView();
  Players.makePlayers();
  Game.debug();
};

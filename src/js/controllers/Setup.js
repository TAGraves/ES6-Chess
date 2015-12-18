"use strict";

var Board = require("./Board");
var Players = require("./Players");
var Game = require("./Game");

var Setup = module.exports = function () {
  Board.makeView();
  Board.makeState();
  Players.makePlayers();
  Game.debug();
};

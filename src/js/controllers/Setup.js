"use strict";

var Board = require("./Board");
var Players = require("./Players");
var Game = require("./Game");
var Move = require("../models/Move");
var Setup = module.exports = function () {
  Board.makeState();
  Board.makeView();
  Players.makePlayers();
  Players.player1.isTurnPlayer = true;
  Game.debug();
};

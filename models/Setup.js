"use strict";

var Board = require("./Board");
var Players = require("./Players");

var Setup = module.exports = function () {
  Board.makeState();
  Players.makePlayers();
};

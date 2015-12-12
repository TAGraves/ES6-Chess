"use strict";

var Board = require("./Board");
var Players = require("./Players");

module.exports = class Piece {
  constructor() {
    this.location = Board.off;
    this.owner = Players.none;
    this.lastMove = false;
  }
};
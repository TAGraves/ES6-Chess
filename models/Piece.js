"use strict";

var Board = require("./Board");
var Players = require("./Players");

module.exports = class Piece {
  constructor(location, owner) {
    this.location = location;
    this.owner = owner;
    this.lastMove = false;
  }
};
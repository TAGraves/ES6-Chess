"use strict";

var Board = require("./Board");

module.exports = class Piece {
  constructor(location, owner) {
    this.location = location;
    this.owner = owner;
    this.hasMoved = false;
    location.occupant = this;
  }
};
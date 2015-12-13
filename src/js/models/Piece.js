"use strict";

var Board = require("../controllers/Board");

module.exports = class Piece {
  constructor(location, owner) {
    this._location = location;
    this.owner = owner;
    this.hasMoved = false;
    this.isCaptured = false;
    location.occupant = this;
    
    this.capture = function () {
      let Board = require("../controllers/Board");
      this._location = Board.off;
      this.isCaptured = true;
    };
  }
  
  set location (location) {
    this._location._occupant = Board.dummyPiece;
    if (location.occupant !== Board.dummyPiece) location.occupant.capture();
    this._location = location;
    location._occupant = this;
  }
    
  get location () {
    return this._location;
  }
};
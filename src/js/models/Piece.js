"use strict";

var Board = require("../controllers/Board");
var View = require("../controllers/View");

module.exports = class Piece {
  constructor(location, owner, isDummyPiece) {
    this._location = location;
    this.owner = owner;
    this.hasMoved = false;
    this.isCaptured = false;
    location.occupant = this;
    if(!isDummyPiece) {
      let idString = "pieceInit-" + location.column.toString() + "-" + location.row.toString();
      this.domElement = document.createElement('div');
      View.putPieceOnBoard(this.domElement, location);
    }
    
    this.capture = function () {
      let Board = require("../controllers/Board");
      this._location = Board.off;
      this.isCaptured = true;
    };
  }
  
  set location (location) {
    let Board = require("../controllers/Board");
    this._location._occupant = Board.dummyPiece;
    if (location.occupant !== Board.dummyPiece) location.occupant.capture();
    this._location = location;
    location._occupant = this;
  }
    
  get location () {
    return this._location;
  }
};
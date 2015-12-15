"use strict";


module.exports = class Location {
  
  constructor(name, row, column, occupant) {
    var Board = require("../controllers/Board");
    var Direction = require("../controllers/Direction");

    this.name = name;
    this.row = row;
    this.column = column;
    this._occupant = occupant;  
    
    this.offset = (location) => this.offset.vertical(location) || this.offset.horizontal(location);
    
    this.offset.vertical = (location) => Math.abs(this.row - location.row);
    
    this.offset.horizontal = (location) => Math.abs(this.column - location.column);

    this.isDiagonalTo = (location) => this.offset.vertical(location) === this.offset.horizontal(location);
    
    this.isCardinalTo = (location) => this.offset.vertical(location) === 0 || this.offset.horizontal(location) === 0;
    
    this.getDirection = (location) => Direction.getDirection(this, location);
    
    this.getCardinalDirection = (location, orientation) => Direction.getCardinalDirection(this, location, orientation);
  }
  
  get isOccupied() {
    var Board = require("../controllers/Board");
    return this.occupant !== Board.dummyPiece;
  }
  
  set occupant (piece) {
    this._occupant = piece;
    piece._location = this;
  }
    
  get occupant () {
    return this._occupant;
  }
}
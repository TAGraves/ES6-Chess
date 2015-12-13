"use strict";

module.exports = class Location {
  
  constructor(name, row, column, occupant) {
    var Board = require("../controllers/Board");
    var Direction = require("../controllers/Direction");

    this.name = name;
    this.row = row;
    this.column = column;
    this.occupant = occupant;  
    
    this.offset = function (location) {
      return this.offset.vertical(location) || this.offset.horizontal(location);
    };
    
    this.offset.vertical = (location) => {
      return Math.abs(this.row - location.row);
    };
    
    this.offset.horizontal = (location) => {
      return Math.abs(this.column - location.column);
    };

    this.isDiagonalTo = function (location) {
      return this.offset.vertical(location) === this.offset.horizontal(location);
    };
    
    this.isCardinalTo = function (location) {
      return this.offset.vertical(location) === 0 || this.offset.horizontal(location) === 0;
    };
    
    this.getDirection = function (location) {
      return Direction.getDirection(this, location);
    }
    
    this.getCardinalDirection = function (location, orientation) {
      return Direction.getCardinalDirection(this, location, orientation);
    };
  }
  
  get isOccupied() {
    var Board = require("../controllers/Board");
    return this.occupant !== Board.dummyPiece;
  }
    
  
}
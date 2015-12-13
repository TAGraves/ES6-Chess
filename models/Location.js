"use strict";

var Board = require("./Board");
var Direction = require("./Direction");

module.exports = class Location {
  constructor(name, row, column) {
    this.name = name;
    this.row = row;
    this.column = column;
    this.occupant = null;
    
    this.go = {
      right: function (steps) {
        return Board.state[this.row, this.column + steps] || Board.off;
      },
      left: function (steps) {
        return Board.state[this.row, this.column - steps] || Board.off;
      },
      up: function () {
        
      }
    };
    
    this.offset = function (location) {
      return this.offset.vertical(location) || this.offset.horizontal(location);
    };
    
    this.offset.vertical = function (location) {
      return Math.abs(this.row - location.row);
    };
    
    this.offset.horizontal = function (location) {
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
    return this.occupant !== null;
  }
    
  
}
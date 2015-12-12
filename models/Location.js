"use strict";

var Board = require("./Board");

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
    }
    
    this.isDiagonalTo = function (location) {
      let columnOffset = Math.abs(this.column - location.column),
          rowOffset = Math.abs(this.row - location.row);
      return columnOffset === rowOffset;
    };
    
    this.isCardinalTo = function (location) {
      return ( (this.column === location.column) || (this.row === location.row) );
    };
  }
  
  get isOccupied() {
    return this.occupant !== null;
  }
    
  
}
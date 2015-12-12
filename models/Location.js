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
    
    this.isDiagonalTo = function (location) {;
      return Math.abs(this.column - location.column) === Math.abs(this.row - location.row);
    };
    
    this.isCardinalTo = function (location) {
      return (this.column === location.column) || (this.row === location.row);
    };
    
    this.offset = function (location) {
      return Math.abs(this.column - location.column) || Math.abs(this.row - location.row);
    };
  }
  
  get isOccupied() {
    return this.occupant !== null;
  }
    
  
}
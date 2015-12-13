"use strict";
var Location = require("./Location");

var Board = module.exports = {

  state: (function generateBoard () {
    let rows = [];
    for (let i = 0; i < 8; i++) {
      let column = [];
      for (let j = 0; j < 8; j++) {
        let alphabet = "abcdefgh";
        let name = alphabet.charAt(j) + (i+1).toString();
        column.push(new Location(name, i, j));
      }
      rows.push(column);
    }
    return rows;
  })(),
  off: new Location("off", -1, -1),
  setLocation: function (piece, location) {},
  traverse: function (location, distance, direction) {
    let column = location.column,
        row = location.row;
    switch (direction) {
      case "north": 
        return Board.state[column][row+distance];
        break;
      case "south":
        return Board.state[column][row-distance];
        break;
      case "east":
        return Board.state[column+distance][row];
        break;
      case "west":
        return Board.state[column-distance][row];
        break;
      case "northeast": 
        return Board.state[column+distance][row+distance];
        break;
      case "northwest":
        return Board.state[column+distance][row-distance];
        break;
      case "southeast":
        return Board.state[column-distance][row+distance];
        break;
      case "southwest":
        return Board.state[column-distance][row+distance];
        break;
    }
  },
  pathIsOccupied: function (startLocation, endLocation) {
    let direction = startLocation.getDirection(endLocation),
        offset = startLocation.offset(endLocation);
    for (let i = 1; i < offset; i++) {
      if (Board.traverse(startLocation, i, direction).isOccupied) return true;
    }
    return false;
  }
};
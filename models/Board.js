"use strict";
var Players = require("./Players");
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
  traverse: function (location, distance, direction) {},
  pathIsOccupied: function (location1, location2) {},
};

console.log(Board.state);
console.log(Board.state[0][0].isOccupied);
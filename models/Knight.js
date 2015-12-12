"use strict";

var Board = require("./Board");
var Players = require("./Players");
var Game = require ("./Game");
var Piece = require ("./Piece");

module.exports = class Knight extends Piece {
  constructor (location, owner) {
    super(location, owner);
    this.moveTo = function (location) {
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && !location.occupant.owner === this.owner
        && (
          (Board.verticalOffset(this.location, location) === 2 && Board.horizontalOffset(this.location, location) === 1)
          || (Board.verticalOffset(this.location, location) === 1 && Board.horizontalOffset(this.location, location) === 2)
        )
      ){
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      } 
    }
  }
}
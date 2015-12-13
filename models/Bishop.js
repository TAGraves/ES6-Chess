"use strict";

var Board = require("./Board");
var Game = require ("./Game");
var Piece = require ("./Piece");

module.exports = class Bishop extends Piece {
  constructor (location, owner) {
    super(location, owner);
    this.moveTo = function (location) {
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && this.location.isDiagonalTo(location) 
        && !Board.pathIsOccupied(this.location, location)
        && !location.occupant.owner === this.owner
      ){
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      }
    }
  }
};
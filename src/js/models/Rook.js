"use strict";

var Board = require("../controllers/Board");
var Game = require ("../controllers/Game");
var Piece = require ("./Piece");

module.exports = class Rook extends Piece {
  constructor (location, owner) {
    super(location, owner);
    this.moveTo = function (location) {
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && this.location.isCardinalTo(location)
        && !Board.pathIsOccupied(this.location, location)
        && location.occupant.owner !== this.owner
      ){
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      }
    }
  }
  
  get threateningCheck() {
    let king = this.owner.otherPlayer.king;
    return (this.location.isCardinalTo(king.location) && !Board.pathIsOccupied(this.location, king.location));
  }

}
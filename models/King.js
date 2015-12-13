"use strict";

var Board = require("./Board");
var Game = require ("./Game");
var Piece = require ("./Piece");
var Direction = require ("./Direction");

module.exports = class King extends Piece {
  constructor (location, owner) {
    super(location, owner);
    this.moveTo = function (location) {
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && !location.occupant.owner === this.owner
        && this.location.offset(location) === 1
      ){
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      } 
    }
    
    this.castle = function (rook) {
      var direction = this.location.getCardinalDirection(rook.location, "horizontal"),
          location  = Board.traverse(this.location, 2, direction);
      if (
        !rook.hasMoved 
        && !this.hasMoved
        && !Board.pathIsOccupied(this.location, rook.location)
        && !Game.moveWillPutOwnerInCheck(this, location)
        && !Game.moveWillPutOwnerInCheck(this, Board.traverse(this.location, 1, direction)) //so it can't move through check
      ) {
        Board.setLocation(this, location, false);
        Board.setLocation(rook, Board.traverse(location, 1, Direction.reverse(direction)));
      } else {
        Game.throwError.illegalMove();
      }
    }
  }
  
  get threateningCheck() {
    return false;
  }

}
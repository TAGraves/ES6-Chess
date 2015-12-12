"use strict";

var Board = require("./Board");
var Players = require("./Players");
var Game = require ("./Game");
var Piece = require ("./Piece");

module.exports = class Pawn extends Piece {
  constructor (location, owner) {
    super(location, owner);
    this.moveTo = function (location) {
      var offset = Board.offset(this.location, location);
      var moveSucceeded = false;
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && Board.verticalDirection(this.location, location) === Players.otherPlayer(this.owner).home
        && offset < 3
      ){
        if (Board.isVertical(this.location, location)) {
          if (offset === 1 && !location.isOccupied) { //move one forward
            this.hasMoved = true;
            Board.setLocation(this, location);
            moveSucceeded = true;
          } else if ( //move two forward
            offset === 2
            && !location.isOccupied
            && !Board.pathIsOccupied(this.location, location)
            && this.hasMoved === false
          ){
            this.hasMoved = true;
            Board.setLocation(this, location);
            this.justMovedTwo = true;
            moveSucceeded = true;
          } 
        } else if (Board.isDiagonal(this.location, location) && offset === 1) {
          if (location.isOccupied && !location.occupant.owner === this.owner) {
            this.hasMoved = true;
            Board.setLocation(this, location);
            moveSucceded = true;
          } else if (!Board.isOccupied(location) && Board.traverse(location, 1, this.owner.home).occupant.justMovedTwo) { //en passant
            this.hasMoved = true;
            Board.setLocation(this, location);
            moveSucceeded = true;
          }
        }
      }
      
      if (!moveSucceeded) {
        Game.throwError.illegalMove();
      }
    }
  }
}
"use strict";

var Board = require("./Board");
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
          (this.location.offset.vertical(location) === 2 && this.location.offset.horizontal(location) === 1)
          || (this.location.offset.vertical(location) === 1 && this.location.offset.horizontal(location) === 2)
        )
      ){
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      } 
    }
  }
  
  get threateningCheck() {
    let king = this.owner.otherPlayer.king;
    
    if (
      (this.location.offset.vertical(king.location) === 2 && this.location.offset.horizontal(location) === 1)
      || (this.location.offset.vertical(king.location) === 1 && this.location.offset.horizontal(king.location) === 2)
    ){
      return true;
    } else {
      return false;
    }
  }

}
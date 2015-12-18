"use strict";

var Board = require("../controllers/Board");
var Game = require ("../controllers/Game");
var Piece = require ("./Piece");

module.exports = class Knight extends Piece {
  constructor (location, owner) {
    super(location, owner, false);
    this.domElement.className = "piece knight player" + this.owner.id;
    this.moveTo = function (location) {
      if (
        !Board.moveWillPutOwnerInCheck(this, location)
        && location.occupant.owner !== this.owner
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
      (this.location.offset.vertical(king.location) === 2 && this.location.offset.horizontal(king.location) === 1)
      || (this.location.offset.vertical(king.location) === 1 && this.location.offset.horizontal(king.location) === 2)
    ){
      return true;
    } else {
      return false;
    }
  }

}
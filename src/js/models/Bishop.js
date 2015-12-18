"use strict";

var Board = require("../controllers/Board");
var Game = require ("../controllers/Game");
var Piece = require ("./Piece");

module.exports = class Bishop extends Piece {
  constructor (location, owner) {
    super(location, owner, false);
    this.domElement.className = "piece bishop player" + this.owner.id;
    this.moveTo = function (location) {
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && this.location.isDiagonalTo(location) 
        && !Board.pathIsOccupied(this.location, location)
        && location.occupant.owner !== this.owner
      ){
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      }
    };
  }
  
  get threateningCheck() {
    let king = this.owner.otherPlayer.king;
    
    if (this.location.isDiagonalTo(king.location) && !Board.pathIsOccupied(this.location, king.location)) {
      return true;
    } else {
      return false;
    }
  }
};
"use strict";

var Board = require("../controllers/Board");
var Game = require ("../controllers/Game");
var Piece = require ("./Piece");
var Direction = require ("../controllers/Direction");

module.exports = class King extends Piece {
  constructor (location, owner) {
    super(location, owner, false);
    this.domElement.className = "piece king player" + this.owner.id;    
    this.moveTo = function (location) {
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && location.occupant.owner !== this.owner
        && this.location.offset(location) === 1
      ){
        Board.setLocation(this, location);
      } else if (this.location.offset(location) === 2) {
        this.castle(location);
      } else {
        Game.throwError.illegalMove();
      } 
    }
    
    this.castle = function (location) {
      if (
        (location.row === 0 || location.row === 7)
        && (location.column === 2 || location.column === 6)
      ) {
        let Rook = require("./Rook")
        let direction = this.location.getDirection(location);
        let rook = (direction === "west") ? Board.traverse(location, 2, direction).occupant : Board.traverse(location, 1, direction).occupant;
        if (
          rook instanceof Rook
          && !rook.hasMoved 
          && !this.hasMoved
          && !Board.pathIsOccupied(this.location, rook.location)
          && !Game.moveWillPutOwnerInCheck(this, location)
          && !Game.moveWillPutOwnerInCheck(this, Board.traverse(this.location, 1, direction)) //so it can't move through check
        ) {
          Board.setLocation(this, location, false);
          Board.setLocation(rook, Board.traverse(location, 1, Direction.reverse(direction)));
        } else {
          Game.throwError.illegalCastle();
        }
      } else {
        Game.throwError.illegalCastle();
      }
    }
  }
  
  get threateningCheck() {
    return false;
  }

}
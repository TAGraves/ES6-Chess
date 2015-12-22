"use strict";

var Board = require("../controllers/Board");
var Game = require ("../controllers/Game");
var Piece = require ("./Piece");
var Direction = require ("../controllers/Direction");

module.exports = class King extends Piece {
  constructor (location, owner) {
    super(location, owner, false);
    this.domElement.className = "piece king player" + this.owner.id;        
    this.domElement.innerHTML = (this.owner.id === 1) ? "&#9812;" : "&#9818;";
    
    this.checkLocation = function (location) {
      let moveSucceeded = false;
      let moveType = 1;
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && location.occupant.owner !== this.owner
        && this.location.offset(location) === 1
      ){
        moveSucceeded = true;
      } else if (this.location.offset(location) === 2) {
        moveSucceeded = true;
        moveType = 2;
        //this.castle(location);
      } 
      
      return {
        success: moveSucceeded,
        type: moveType
      }
    }
    
    this.moveTo = function (location) {
      let tryMove = this.checkLocation(location);
      if (tryMove.success) {
        if (tryMove.type === 1) Board.setLocation(this, location);
        if (tryMove.type === 2) this.castle(location);
        this.hasMoved = true;
        return this;
      } else {
        Game.throwError.illegalMove();
        return false;
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
        console.log(rook.hasMoved, this.hasMoved);
        if (
          rook instanceof Rook
          && !rook.hasMoved 
          && !this.hasMoved
          && !Board.pathIsOccupied(this.location, rook.location)
          && !Game.moveWillPutOwnerInCheck(this, location)
          && !Game.moveWillPutOwnerInCheck(this, Board.traverse(this.location, 1, direction)) //so it can't move through check
        ) {
          Board.setLocation(this, location, false);
          return Board.setLocation(rook, Board.traverse(location, 1, Direction.reverse(direction)));
        } else {
          Game.throwError.illegalCastle();
          return false;
        }
      } else {
        Game.throwError.illegalCastle();
        return false;
      }
    }
  }
  
  get threateningCheck() {
    return false;
  }

}
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
    this.notation = 'K';
    
    this.checkLocation = function (location) {
      let moveSucceeded = false;
      let moveType = 1;
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && location.occupant.owner !== this.owner
        && this.location.offset(location) === 1
        && this.owner.isTurnPlayer
      ){
        moveSucceeded = true;
      } else if (
        this.location.offset(location) === 2
        && (location.row === this.owner.id-1 || location.row === this.owner.id+5)
        && (location.column === 2 || location.column === 6)
        && this.owner.isTurnPlayer
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
          moveSucceeded = true;
          moveType = 2;
        }
      } 
      
      return {
        success: moveSucceeded,
        type: moveType
      }
    }
    
    this.moveTo = function (location) {
      let tryMove = this.checkLocation(location);
      if (tryMove.success) {
        this.castled = false;
        this.owner.justMovedTwo = {
          didMove: false,
          piece: Board.dummyPiece
        }
        if (tryMove.type === 1) Board.setLocation(this, location);
        if (tryMove.type === 2) this.castle(location);
        this.hasMoved = true;
        return true;
      } else {
        Game.throwError.illegalMove();
        return false;
      } 
    }
    
    this.castle = function (location) {
      let direction = this.location.getDirection(location);
      let rook = (direction === "west") ? Board.traverse(location, 2, direction).occupant : Board.traverse(location, 1, direction).occupant;
      rook.hasMoved = true;
      this.castled = (direction === "west") ? '0-0-0' : '0-0';
      Board.setLocation(rook, Board.traverse(location, 1, Direction.reverse(direction)), false);
      return Board.setLocation(this, location);
    }
    
    this.moveIsAmbiguous = () => '';
    
  }
  
  get threateningCheck() {
    return false;
  }

}
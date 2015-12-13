"use strict";

var Game = require("../controllers/Game");
var Board = require("../controllers/Board");
var Players = require("../controllers/Players");
var Piece = require ("./Piece");

module.exports = class Pawn extends Piece {
  constructor (location, owner) {
    super(location, owner);
    this.moveTo = function (location) {
      var offset = this.location.offset(location);
      var moveSucceeded = false;
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && this.location.getCardinalDirection(location) === this.owner.otherPlayer.home
        && offset < 3
      ){
        if (this.location.offset.horizontal(location) === 0) {
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
        } else if (offset === 1) {
          if (location.isOccupied && location.occupant.owner !== this.owner) { //capture
            this.hasMoved = true;
            Board.setLocation(this, location);
            moveSucceeded = true;
          } else if (!location.isOccupied && Board.traverse(location, 1, this.owner.home).occupant.justMovedTwo) { //en passant
            this.hasMoved = true;
            let oppOccupant = Board.traverse(location, 1, this.owner.home).occupant;
            oppOccupant.location.occupant = Board.dummyPiece; //hack to make sure piece gets captured
            location.occupant = oppOccupant; //hack to make sure piece gets captured
            Board.setLocation(this, location);
            console.log(oppOccupant);
            moveSucceeded = true;
          }
        }
      }
      
      if (!moveSucceeded) {
        Game.throwError.illegalMove();
      }
    }
  }
  
  get threateningCheck() {
    let king = this.owner.otherPlayer.king;
    
    if (
      (
        this.location.getDirection(king.location) === (this.owner.otherPlayer.home) + "west"
        || this.location.getDirection(king.location) === (this.owner.otherPlayer.home) + "east"
      )
      && this.location.offset(king.location) === 1 
    ){
      return true;
    } else {
      return false;
    }
  }

}
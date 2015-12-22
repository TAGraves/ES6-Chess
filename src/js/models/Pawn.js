"use strict";

var Game = require("../controllers/Game");
var Board = require("../controllers/Board");
var Players = require("../controllers/Players");
var Piece = require ("./Piece");

module.exports = class Pawn extends Piece {
  constructor (location, owner) {
    super(location, owner, false);
    this.domElement.className = "piece pawn player" + this.owner.id;
    this.domElement.innerHTML = (this.owner.id === 1) ? "&#9817;" : "&#9823;";

    this.checkLocation = function (location) {
      var offset = this.location.offset(location),
          moveSucceeded = false,
          moveType = 0;
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && this.location.getCardinalDirection(location) === this.owner.otherPlayer.home
        && offset < 3
      ){
        if (this.location.offset.horizontal(location) === 0) {
          if (offset === 1 && !location.isOccupied) { //move one forward
            moveSucceeded = true;
            moveType = 1;
          } else if ( //move two forward
            offset === 2
            && !location.isOccupied
            && !Board.pathIsOccupied(this.location, location)
            && this.hasMoved === false
          ){
            moveSucceeded = true;
            moveType = 3;
          } 
        } else if (offset === 1) {
          if (location.isOccupied && location.occupant.owner !== this.owner) { //capture
            moveSucceeded = true;
            moveType = 1;
          } else if (!location.isOccupied && Board.traverse(location, 1, this.owner.home).occupant.justMovedTwo) { //en passant
            moveSucceeded = true;
            moveType = 2;
          }
        }
      }
      
      return {
        success: moveSucceeded,
        type: moveType
      };
    };
    
    this.moveTo = function (location) {
      let tryMove = this.checkLocation(location);
      if (tryMove.success) {
        if (tryMove.type === 2) {
          let oppOccupant = Board.traverse(location, 1, this.owner.home).occupant;
          oppOccupant.capture();
        }
        
        if(tryMove.type === 3) {
          this.justMovedTwo = true;
        }
        this.hasMoved = true;
        return Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
        return false;
      }
    }
  }
  
  get threateningCheck() {
    let king = this.owner.otherPlayer.king;
    
    return ((this.location.getDirection(king.location) === (this.owner.otherPlayer.home) + "west"
         || this.location.getDirection(king.location) === (this.owner.otherPlayer.home) + "east")
         && this.location.offset(king.location) === 1);
  }

}
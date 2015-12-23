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
    this.notation = '';
    
    this.checkLocation = function (location) {
      var offset = this.location.offset(location),
          moveSucceeded = false,
          moveType = 0;
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && this.location.getCardinalDirection(location) === this.owner.otherPlayer.home
        && offset < 3
        && this.owner.isTurnPlayer
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
          } else if (!location.isOccupied && this.owner.otherPlayer.justMovedTwo.didMove) { //en passant
            if (this.owner.otherPlayer.justMovedTwo.piece === Board.traverse(location, 1, this.owner.home).occupant) {
              moveSucceeded = true;
              moveType = 2;
            }
          }
        }
      }
      
      if (moveSucceeded && (location.row === 7 || location.row === 0)) { //promotion
        moveType = 4;
      }
      
      return {
        success: moveSucceeded,
        type: moveType
      };
    };
    
    this.moveTo = function (location) {
      let tryMove = this.checkLocation(location);
      if (tryMove.success) {
        
          this.owner.justMovedTwo = {
            didMove: false,
            piece: Board.dummyPiece
          }

        if (tryMove.type === 2) {
          let oppOccupant = Board.traverse(location, 1, this.owner.home).occupant;
          oppOccupant.capture();
        }
        
        if (tryMove.type === 3) {
          this.owner.justMovedTwo = {
            didMove: true,
            piece: this
          }
        }
        
        if (tryMove.type === 4) {
          return this.promote(location);
        }
        
        this.hasMoved = true;
        return Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
        return false;
      }
    };
    
    this.promote = function (location) {
      let pieceType = prompt('Which piece do you want? Answers are "Queen" "Bishop" "Knight", "Rook" without quotes');
      
      switch (pieceType) {
        case "Queen": break;
        case "Bishop": break;
        case "Knight": break;
        case "Rook": break;
        default: this.promote(location); return false;
      }
      
      let pieces = require("../controllers/Pieces");
      let piece = new pieces[pieceType](this.location, this.owner);
      
      for (let index in this.owner.pieces) {
        if (this.owner.pieces[index] === this) {
          this.owner.pieces[index] = piece;
          this.capture();
        }
      }
      piece.hasMoved = true;
      Board.setLocation(piece, location);
      return true;
    }
  }
  
  get threateningCheck() {
    let king = this.owner.otherPlayer.king;
    return ((this.location.getDirection(king.location) === (this.owner.otherPlayer.home) + "west"
         || this.location.getDirection(king.location) === (this.owner.otherPlayer.home) + "east")
         && this.location.offset.vertical(king.location) === 1
         && this.location.offset.horizontal(king.location) === 1);
  }

}
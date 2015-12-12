import Board from "Board"
import Players from "Players"
import Game from "Game"
import Piece from "Piece"

export class King extends Piece {
  constructor {
    this.moveTo = function (location) {
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && !Board.pieceAt(location).owner === this.owner
        && Board.offset(this.location, location) === 1
      ){
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      } 
    }
    
    this.castle = function (rook) {
      var direction = Board.horizontalDirection(this.location, rook.location),
          location  = Board.traverse(this.location, 2, direction);
      if (
        !rook.hasMoved 
        && !this.hasMoved
        && !Board.pathIsOccupied(this.location, rook.location)
        && !Game.moveWillPutOwnerInCheck(this, location)
        && !Game.moveWillPutOwnerInCheck(this, Board.traverse(this.location, 1, direction)) //so it can't move through check
      ) {
        Board.setLocation(this, location, false);
        Board.setLocation(rook, Board.traverse(location, 1, Board.oppositeDirection(direction));
      } else {
        Game.throwError.illegalMove();
      }
    }
  }
}
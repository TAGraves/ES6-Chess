import Board from "Board"
import Players from "Players"
import Game from "Game"
import Piece from "Piece"

export class Pawn extends Piece {
  constructor {
    this.moveTo = function (location) {
      var offset = Board.offset(this.location, location);
      var moveSucceeded = false;
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && Board.verticalDirection(this.location, location) === Players.otherPlayer(this.owner).home
        && offset < 3
      ){
        if (Board.isVertical(this.location, location)) {
          if (offset === 1 && !Board.isOccupied(location)) { //move one forward
            this.hasMoved = true;
            Board.setLocation(this, location);
            moveSucceeded = true;
          } else if ( //move two forward
            offset === 2
            && !Board.isOccupied(location)
            && !Board.pathIsOccupied(this.location, location)
            && this.hasMoved === false
          ){
            this.hasMoved = true;
            Board.setLocation(this, location);
            this.justMovedTwo = true;
            moveSucceeded = true;
          } 
        } else if (Board.isDiagonal(this.location, location) && offset === 1) {
          if (Board.isOccupied(location) && !Board.pieceAt(location).owner === this.owner) {
            this.hasMoved = true;
            Board.setLocation(this, location);
            moveSucceded = true;
          } else if (Board.isEmpty(location) && Board.pieceAt( Board.traverse(location, 1, this.owner.home) ).justMovedTwo) { //en passant
            this.hasMoved = true;
            Board.setLocation(this, location);
            moveSucceeded = true;
          }
        }
      }
      
      if (!moveSucceeded) {
        Game.throwError.illegalMove();
      }
    }
  }
}
import Board from "Board"
import Players from "Players"
import Game from "Game"
import Piece from "Piece"

export class Queen extends Piece {
  constructor {
    this.moveTo = function (location) {
      if (
        && !Game.moveWillPutOwnerInCheck(this, location)
        && (
          Board.isDiagonal(this.location, location)
          || Board.isCardinal(this.location, location)
        )
        && !Board.pathIsOccupied(this.location, location)
        && !Board.pieceAt(location).owner === this.owner
      ){
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      }
    }
  }
}
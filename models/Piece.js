import Board from "Board";
import Players from "Players";

export class Piece {
  constructor() {
    this.location = Board.off;
    this.owner = Players.none;
    this.lastMove = false;
  }
}
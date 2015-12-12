//import Board
//import Players
//import Game

var Piece = class {
  constructor() {
    this.location = Board.off;
    this.owner = Players.none;
    this.lastMove = false;
  }
};
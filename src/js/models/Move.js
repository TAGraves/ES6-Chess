"use strict";

var Board = require("../controllers/Board");

class Move {
  constructor(piece, destination, modals = {isEnPassant: false, isCastle: false, capturePiece: Board.dummyPiece}) {
    Move.moveList.push(this);
    piece.lastMove = this;
    piece.owner.lastMove = this;
    
    this.piece = piece;
    this.owner = piece.owner;
    this.origin = piece.location;
    this.destination = destination;
    this.capture = modals.isEnPassant || destination.isOccupied;
    if (this.capture) this.capturePiece = (modals.isEnPassant) ? modals.capturePiece : destination.occupant;
    this.notation = {
      ambiguity: "",
      letter: this.piece.notation
    };
    
    this.processMove = function() {
      this.piece.location = this.destination;
      Board.updateView(this.destination, this.piece);
      let turn = (this.owner.id === 1) ? ++Board.turnCounter : Board.turnCounter;      
      View.updateTurn(turn, piece);
      this.owner.otherPlayer.isTurnPlayer = true;
      Game.checkForCheckmate(this.owner.otherPlayer);
      return true;
    }
  }
}

Move.moveList = [];
Move.lastMove = () => Move.moveList[Move.moveList.length];
module.exports = Move;
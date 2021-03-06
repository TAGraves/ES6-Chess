"use strict";

var Board = require("../controllers/Board");
var View = require("../controllers/View");

module.exports = class Piece {
  constructor(location, owner, isDummyPiece) {
    this._location = location;
    this.owner = owner;
    this.hasMoved = false;
    this.isCaptured = false;
    this.enPassant = false;
    this.promoted = false;
    this.justCaptured = '';
    this.ambiguity = '';
    location.occupant = this;
    if(!isDummyPiece) {
      let idString = "pieceInit-" + location.column.toString() + "-" + location.row.toString();
      this.domElement = document.createElement('div');
      View.putPieceOnBoard(this, location);
    }
    
    this.moveTo = function (location) {
      let Board = require("../controllers/Board");
      if (this.checkLocation(location).success) {
        this.hasMoved = true;
        this.owner.justMovedTwo = {
          didMove: false,
          piece: Board.dummyPiece
        }
        
        this.ambiguity = this.moveIsAmbiguous(location);
        
        return Board.setLocation(this, location);
      } else {
        let Game = require("../controllers/Game");
        Game.throwError.illegalMove();
        return false;
      } 
    }
    
    this.capture = function () {
      let Board = require("../controllers/Board");
      this._location = Board.off;
      this.isCaptured = true;
      Board.capture(this);
    }
    
    this.moveIsAmbiguous = function (location) {
      let pieces = this.owner.pieces;
      let ambiguity = '';
      let count = 0;
      for (let piece of pieces) {
        if (piece.notation === this.notation && piece.checkLocation(location).success && this !== piece) {
          console.log(piece.notation, this.notation, piece.checkLocation(location).success);
          ambiguity = (this.location.column === piece.location.column) ? this.location.name[1] : this.location.name[0];
          count++
          if (count > 1) ambiguity = this.location.name;
        }
      }
      
      return ambiguity;
    }
  }
  
  set location (location) {
    let Board = require("../controllers/Board");
    this._location._occupant = Board.dummyPiece;
    this.justCaptured = '';
    if (location.occupant !== Board.dummyPiece) {
      location.occupant.capture();
      this.justCaptured = 'x';
    }
    this._location = location;
    location._occupant = this;
  }
    
  get location () {
    return this._location;
  }

};
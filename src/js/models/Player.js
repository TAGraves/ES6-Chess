"use strict";

module.exports = class Player {
  constructor(id, home) {
    this.id = id;
    this.home = home;
    this.pieces = [];
    this._isTurnPlayer = false;
    
    this.filterPieces = function (pieceType) {
      let pieceArray = [];
      for (let piece of this.pieces) {
        if (piece instanceof pieceType) pieceArray.push(piece);
      }
      return pieceArray;
    };
  }
  
  get king() {
    return this.pieces[4];
  }
  
  get otherPlayer() {
    let Players = require("../controllers/Players");
    return Players.reverse(this);
  }
  
  get isTurnPlayer() {
    return this._isTurnPlayer;
  }
  
  set isTurnPlayer(b) {
    this._isTurnPlayer = true;
    this.otherPlayer._isTurnPlayer = false;
  }
  
}

"use strict";

var Board = require("../controllers/Board");
var Game = require ("../controllers/Game");
var Piece = require ("./Piece");

module.exports = class Bishop extends Piece {
  constructor (location, owner) {
    super(location, owner, false);
    this.domElement.className = "piece bishop player" + this.owner.id;
    this.domElement.innerHTML = (this.owner.id === 1) ? "&#9815;" : "&#9821;";
    
    this.checkLocation = function (location) {
      let moveSucceeded = false;
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && this.location.isDiagonalTo(location) 
        && !Board.pathIsOccupied(this.location, location)
        && location.occupant.owner !== this.owner
        && this.owner.isTurnPlayer
      ) moveSucceeded = true;

      return {
        success: moveSucceeded,
        type: 1
      }
    }
    
  }
  
  get threateningCheck() {
    let king = this.owner.otherPlayer.king;
    
    if (this.location.isDiagonalTo(king.location) && !Board.pathIsOccupied(this.location, king.location)) {
      return true;
    } else {
      return false;
    }
  }
};
"use strict";

var Board = require("../controllers/Board");
var Game = require ("../controllers/Game");
var Piece = require ("./Piece");

module.exports = class Knight extends Piece {
  constructor (location, owner) {
    super(location, owner, false);
    this.domElement.className = "piece knight player" + this.owner.id;
    this.domElement.innerHTML = (this.owner.id === 1) ? "&#9816;" : "&#9822;";
    
    this.checkLocation = function (location) {
      let moveSucceeded = false;
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && location.occupant.owner !== this.owner
        && (
          (this.location.offset.vertical(location) === 2 && this.location.offset.horizontal(location) === 1)
          || (this.location.offset.vertical(location) === 1 && this.location.offset.horizontal(location) === 2)
        )
      ) moveSucceeded = true;
      
      return {
        success: moveSucceeded,
        type: 1
      }
    }
    
  }
  
  get threateningCheck() {
    let king = this.owner.otherPlayer.king;
    if (
      (this.location.offset.vertical(king.location) === 2 && this.location.offset.horizontal(king.location) === 1)
      || (this.location.offset.vertical(king.location) === 1 && this.location.offset.horizontal(king.location) === 2)
    ){
      return true;
    } else {
      return false;
    }
  }

}
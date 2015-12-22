"use strict";

var Board = require("../controllers/Board");
var Game = require ("../controllers/Game");
var Piece = require ("./Piece");

module.exports = class Queen extends Piece {
  constructor (location, owner) {
    super(location, owner, false);
    this.domElement.className = "piece queen player" + this.owner.id;
    this.domElement.innerHTML = (this.owner.id === 1) ? "&#9813;" : "&#9819;";

    this.checkLocation = function (location) {
      let moveSucceeded = false;
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && (
          this.location.isDiagonalTo(location)
          || this.location.isCardinalTo(location)
        )
        && !Board.pathIsOccupied(this.location, location)
        && location.occupant.owner !== this.owner
      ) moveSucceeded = true;

      return {
        success: moveSucceeded,
        type: 1
      }
    }

  }
  
  get threateningCheck() {
    let king = this.owner.otherPlayer.king;
    return ((this.location.isDiagonalTo(king.location)
          || this.location.isCardinalTo(king.location))
          && !Board.pathIsOccupied(this.location, king.location));
  }

}
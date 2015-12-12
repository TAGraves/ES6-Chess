"use strict";

var Board = require("./Board");
var Players = require("./Players");
var Game = require ("./Game");
var Piece = require ("./Piece");

module.exports = class Bishop extends Piece {
  constructor () {
    this.moveTo = function (location) {
      if (
        !Game.moveWillPutOwnerInCheck(this, location)
        && Board.isDiagonal(this.location, location) 
        && !Board.pathIsOccupied(this.location, location)
        && !Board.pieceAt(location).owner === this.owner
      ){
        Board.setLocation(this, location);
      } else {
        Game.throwError.illegalMove();
      }
    }
  }
};
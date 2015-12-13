"use strict";

var King = require("../models/King");
var Queen = require("../models/Queen");
var Rook = require("../models/Rook");
var Bishop = require("../models/Bishop");
var Knight = require("../models/Knight");
var Pawn = require("../models/Pawn");
var Piece = require("../models/Piece");
var Board = require("./Board");

var Pieces = module.exports = {
  King: King,
  Queen: Queen,
  Rook: Rook,
  Bishop: Bishop,
  Knight: Knight,
  Pawn: Pawn,
  makePieces: function (player) {
    let pieceArray;
    let rowIndex = (player.id === 1) ? 0 : 7;
    let pawnIndex = (player.id === 1) ? 1 : 6;
    
    pieceArray = [
      new Rook(Board.state[0][rowIndex], player),
      new Knight(Board.state[1][rowIndex], player),
      new Bishop(Board.state[2][rowIndex], player),
      new Queen(Board.state[3][rowIndex], player),
      new King(Board.state[4][rowIndex], player),
      new Bishop(Board.state[5][rowIndex], player),
      new Knight(Board.state[6][rowIndex], player),
      new Rook(Board.state[7][rowIndex], player)
    ];
    
    for (let i = 0; i < 8; i++) {
      pieceArray.push( new Pawn(Board.state[i][pawnIndex], player) )
    }
    
    return pieceArray;
    
  }
}
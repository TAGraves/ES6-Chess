"use strict";

var King = require("./King");
var Queen = require("./Queen");
var Rook = require("./Rook");
var Bishop = require("./Bishop");
var Knight = require("./Knight");
var Pawn = require("./Pawn");


var Pieces = module.exports = {
  King: King,
  Queen: Queen,
  Rook: Rook,
  Bishop: Bishop,
  Knight: Knight,
  Pawn: Pawn
}
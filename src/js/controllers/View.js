"use strict";

var View = module.exports = {
  makeView: function () {
    let Board = require('./Board');
    let pane = document.getElementById('pane');
    let board = document.createElement('div');
    board.className = 'board';
    for (let i = 7; i > -1; i--) {
        let row = document.createElement('div');
        let evenOrOdd = (i%2) ? 'even' : 'odd';
        row.className = 'row ' + evenOrOdd;
        row.id = 'row-' + i.toString();
        for (let j = 0; j < 8; j++) {
          let square = document.createElement('div');
          let evenOrOdd = (j%2) ? 'even' : 'odd';
          square.className = 'square ' + evenOrOdd;
          square.id = 'square-' + i.toString() + '-' + j.toString();
          Board.state[j][i].domElement = square;
          row.appendChild(square);
        }
        board.appendChild(row);
    } 
    pane.appendChild(board);
  },
  putPieceOnBoard: function (piece, location) {
    let square = location.domElement;
    square.appendChild(piece);
  },
  removePiece: function (piece) {
    piece.parentNode.removeChild(piece);
  },
  updateView: function () {
    var Board = require('./Board');
    
  },
  updateViewAt: function (location, piece) {
    let Board = require('./Board');
    let square = location.domElement;
    square.appendChild(piece);
  }
}
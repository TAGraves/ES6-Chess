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
          let boardState = Board.state[j][i];
          square.addEventListener('dragenter', (e) => this.dragAndDrop.enter(e, boardState), false);
          square.addEventListener('dragover', (e) => this.dragAndDrop.over(e, boardState), false);
          square.addEventListener('drop', (e) => this.dragAndDrop.drop(e, boardState), false);
          square.addEventListener('dragleave', (e) => this.dragAndDrop.exit(e, boardState), false);
          boardState.domElement = square;
          row.appendChild(square);
        }
        board.appendChild(row);
    } 
    pane.appendChild(board);
  },
  putPieceOnBoard: function (piece, location) {
    let View = this;
    let square = location.domElement;
    piece.domElement.setAttribute('draggable','true');
    square.appendChild(piece.domElement);
    
    piece.domElement.addEventListener('dragstart', (e) => this.dragAndDrop.start(e, piece), false);
    piece.domElement.addEventListener('dragend', this.dragAndDrop.end, false);

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
    square.appendChild(piece.domElement);
  },
  dragAndDrop: {
    piece: {},
    start: function (e, piece) {
      View.dragAndDrop.piece = piece;
      window.setTimeout(() => e.target.style.opacity = "0.4", 0);
    },
    exit: function (e, location) {
      //console.log('exit', location.name);
    },
    enter: function (e, location) {
      if(View.dragAndDrop.piece.checkLocation(location).success) {
        e.preventDefault(); 
        console.log('set!');
      }
    },
    over: function (e, location) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    leave: function (e, piece) {},
    drop: function (e, location) {
      console.log('drop');
      let piece = View.dragAndDrop.piece;
      let square = e.target;
      piece.moveTo(location)
    },
    end: function (e) {
      //console.log('end');
      View.dragAndDrop.piece = {};
      e.target.style.opacity = "1";
    }
  }
}
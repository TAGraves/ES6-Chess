"use strict";

var View = module.exports = {
  makeView: function () {
    let Board = require('./Board');
    let pane = document.getElementById('pane');
    let board = document.createElement('div');
    
    pane.innerHTML = "";
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
          square.addEventListener('dragleave', (e) => this.dragAndDrop.leave(e, boardState), false);
          square.addEventListener('dragover', (e) => this.dragAndDrop.over(e, boardState), false);
          square.addEventListener('drop', (e) => this.dragAndDrop.drop(e, boardState), false);
          boardState.domElement = square;
          row.appendChild(square);
        }
        board.appendChild(row);
    } 
    pane.appendChild(board);
    
    let notation = document.createElement('div');
    notation.id = 'notation';
    pane.appendChild(notation);
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
  updateTurn: function (turn, piece) {
    let notationDiv = document.getElementById('notation'),
        notation = piece.notation + piece.justCaptured + piece.location.name;
    
    if (piece.castled) notation = piece.castled;
    if (piece.promoted) {
      notation = piece.promoted;
      piece.promoted = false;
    }
    if (piece.owner.id === 1) {
      notationDiv.innerHTML += turn + "." + notation + " ";
    } else if (turn%3 !== 0) {
      notationDiv.innerHTML += notation + " ";
    } else {
      notationDiv.innerHTML += notation + "<br>";
    }
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
    enter: function (e, location) {
      e.preventDefault();
      if(View.dragAndDrop.piece.location !== location) location.domElement.className += " active";
    },
    over: function (e, location) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    leave: function (e, location) {
      e.preventDefault();
      if(View.dragAndDrop.piece.location !== location) location.domElement.className = location.domElement.className.replace(/ active/g, "");
    },
    drop: function (e, location) {
      let piece = View.dragAndDrop.piece;
      let square = e.target;
      piece.moveTo(location)
    },
    end: function (e) {
      View.dragAndDrop.counter = 0;
      View.dragAndDrop.piece = {};
      e.target.style.opacity = "1";
      let active = document.querySelector('.active');
      if (active) active.className = active.className.replace(/active/g, "");
    }
  }
}
"use strict";

var Setup = require("./controllers/Setup");

document.getElementById('startButton').addEventListener('click', function () {
  this.style.display = 'none';
  Setup();
});
//Setup();
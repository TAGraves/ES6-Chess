"use strict";

var Board = require("./Board");

var Direction = module.exports =  {
  north: "north",
  south: "south",
  east: "east",
  west: "west",
  
  getCardinalDirection: function (location1, location2, orientation) {
    let orient = (orientation === "horizontal") ? "column" : "row";
    let offset = location2[orient] - location1[orient];
    if (offset > 0) {
      return (orientation === "horizontal") ? this.east : this.north;
    } else if (offset < 0) {
      return (orientation === "horizontal") ? this.west : this.south;
    } else {
      return null;
    }
  },
  
  getDirection: function (location1, location2) {
    let nsOffset = location2.row - location1.row,
        ewOffset = location2.column - location1.column,
        direction = "";
    if (nsOffset > 0) direction += this.north;
    if (nsOffset < 0) direction += this.south;
    if (ewOffset > 0) direction += this.east;
    if (ewOffset < 0) direction += this.west;
  },
  
  reverse: function (direction) {
    switch (direction) {
      case "north": 
        return "south";
        break;
      case "south":
        return "north";
        break;
      case "east":
        return "west";
        break;
      case "west":
        return "east";
        break;
      case "northeast": 
        return "southwest";
        break;
      case "northwest":
        return "southeast";
        break;
      case "southeast":
        return "northwest";
        break;
      case "southwest":
        return "northeast";
        break;
    }

  }
};
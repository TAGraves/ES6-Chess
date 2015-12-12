import Players from "Players";
import Location from "Location";

export Board = {

  state: (function generateBoard () {
    let rows = [];
    for (let i = 0; i < 8; i++) {
      let column = [];
      for (let i = 0; i < 8; i++) {
        column.push(new Location());
      }
      rows.push(column);
    }
    return rows;
  })(),
  
  pieceAt: function (location) {},
  offset: function (location1, location2) {},
  setLocation: function (piece, location) {},
  horizontalDirection: function (location1, location2) {},
  verticalDirection: function (location1, location2) {},
  traverse: function (location, distance, direction) {},
  pathIsOccupied: function (location1, location2) {},
  verticalOffset: function (location1, location2) {},
  horizontalOffset: function (location1, location2) {},
  isVertical: function (location1, location2) {},
  isDiagonal: function (location1, location2) {},
  isCardinal: function (location1, location2) {},
  isHorizontal: function (location1, location2) {},
  isOccupied: function (location) {}
}
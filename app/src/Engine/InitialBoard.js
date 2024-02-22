import Piece from "./Piece";

var initialBoard = [];

for (var i = 0; i < 8; i++) {
  const row = [];
  for (var j = 0; j < 8; j++) {
    row[j] = 0;
    if (i <= 2 && (i + j) % 2 == 0) {
      row[j] = new Piece({ color: "black", type: "pawn" });
    } else if (i >= 5 && (i + j) % 2 == 0) {
      row[j] = new Piece({ color: "white", type: "pawn" });
    }
  }
  initialBoard.push(row);
}

// var testBoard = [
//   [new Piece({type:'pawn',color:'black'}),0,0,0,0,0,0,0],
//   [0,0,0,0,0,new Piece({type:'pawn',color:'white'}),0,0],
//   [0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,new Piece({type:'pawn',color:'white'}),0,0],
//   [0,0,0,0,new Piece({type:'pawn',color:'black'}),0,0,0],
//   [0,0,0,0,0,0,0,0],
//   [new Piece({type:'pawn',color:'black'}),0,0,0,new Piece({type:'pawn',color:'white'}),0,0,0],
//   [0,0,0,0,0,0,0,0]
// ]
// initialBoard = testBoard

export default initialBoard;

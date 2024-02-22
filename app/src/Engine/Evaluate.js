function Validate(dto, board) {
  var result = { valid: true, eat: null };
  const { from, to, piece } = dto;

  if (board[to[0]][to[1]] != 0) {
    return false; // piece collision
  }

  const drow = to[0] - from[0];
  const dcol = to[1] - from[1];

  if (!CheckDirction(drow, dcol)) {
    result.valid = false;
  }
  if (Math.pow(drow, 2) + Math.pow(dcol, 2) > 8) {
    result.valid = false;
  }
  if (
    Math.pow(drow, 2) + Math.pow(dcol, 2) == 8 &&
    !CheckOppositeColor(
      from,
      [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2],
      board
    )
  ) {
    result.valid = false;
  }

  if (piece.type == "pawn") {
    const coefficient = piece.color == "white" ? -1 : 1;
    if (drow * coefficient < 0) result.valid = false;
  }

  if (Math.pow(drow, 2) + Math.pow(dcol, 2) == 8) {
    result.eat = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  }
  return result;
}

function CheckDirction(drow, dcol) {
  return Math.abs(drow) === Math.abs(dcol);
}
function CheckOppositeColor(c1, c2, board) {
  if (board[c1[0]][c1[1]] == 0 || board[c2[0]][c2[1]] == 0) return false;
  if (board[c1[0]][c1[1]].color == board[c2[0]][c2[1]].color) return false;
  return true;
}
function FindStrictMoves(color, board) {
  var strictMoves = [];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (board[i][j] == 0) continue;
      const piece = board[i][j];
      if (piece.color == color) {
        for (var y = 0; y < 8; y++) {
          for (var x = 0; x < 8; x++) {
            if (Math.abs(i - y) == 2 && Math.abs(j - x) == 2) {
              const dto = { from: [i, j], to: [y, x], piece: piece };
              var { valid } = Validate(dto, board);
              if (valid) {
                strictMoves.push({ from: [i, j], to: [y, x] });
              }
            }
          }
        }
      }
    }
  }

  return strictMoves;
}
function hasStrictMove(color, board) {
  var strictMoves = FindStrictMoves(color, board);
  return strictMoves.length > 0;
}
function hasMove(color, board) {
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (board[i][j] == 0) continue;
      const piece = board[i][j];
      if (piece.color == color) {
        for (var y = 0; y < 8; y++) {
          for (var x = 0; x < 8; x++) {
            const dto = { from: [i, j], to: [y, x], piece: piece };
            var { valid } = Validate(dto, board);
            if (valid) return true;
          }
        }
      }
    }
  }
  return false;
}

export { Validate, FindStrictMoves, hasStrictMove  , hasMove};

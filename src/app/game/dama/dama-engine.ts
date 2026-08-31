export type Owner = "human" | "cpu";
export type Piece = { owner: Owner; king: boolean };
export type Board = (Piece | null)[][];
export type Position = { row: number; col: number };
export type Move = { from: Position; to: Position; captured: Position | null };

const BOARD_SIZE = 8;

const KING_DIRECTIONS: readonly [number, number][] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function isPlayable(pos: Position): boolean {
  return inBounds(pos.row, pos.col) && (pos.row + pos.col) % 2 === 1;
}

function opponentOf(owner: Owner): Owner {
  return owner === "human" ? "cpu" : "human";
}

function forwardRowDelta(owner: Owner): number {
  return owner === "human" ? -1 : 1;
}

function furthestRow(owner: Owner): number {
  return owner === "human" ? 0 : BOARD_SIZE - 1;
}

export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null),
  );

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const pos = { row, col };
      if (!isPlayable(pos)) continue;

      if (row >= 5 && row <= 7) {
        board[row][col] = { owner: "human", king: false };
      } else if (row >= 0 && row <= 2) {
        board[row][col] = { owner: "cpu", king: false };
      }
    }
  }

  return board;
}

function legalMovesForRegularPiece(board: Board, pos: Position, piece: Piece): Move[] {
  const moves: Move[] = [];
  const dr = forwardRowDelta(piece.owner);

  for (const dc of [-1, 1]) {
    const midRow = pos.row + dr;
    const midCol = pos.col + dc;
    if (!inBounds(midRow, midCol)) continue;

    const midCell = board[midRow][midCol];
    if (midCell === null) {
      moves.push({ from: pos, to: { row: midRow, col: midCol }, captured: null });
      continue;
    }

    if (midCell.owner === piece.owner) continue;

    const landRow = pos.row + dr * 2;
    const landCol = pos.col + dc * 2;
    if (inBounds(landRow, landCol) && board[landRow][landCol] === null) {
      moves.push({
        from: pos,
        to: { row: landRow, col: landCol },
        captured: { row: midRow, col: midCol },
      });
    }
  }

  return moves;
}

function legalMovesForKing(board: Board, pos: Position, piece: Piece): Move[] {
  const moves: Move[] = [];

  for (const [dr, dc] of KING_DIRECTIONS) {
    let k = 1;

    while (true) {
      const row = pos.row + dr * k;
      const col = pos.col + dc * k;
      if (!inBounds(row, col)) break;

      const cell = board[row][col];
      if (cell === null) {
        moves.push({ from: pos, to: { row, col }, captured: null });
        k += 1;
        continue;
      }

      if (cell.owner === piece.owner) break;

      const afterRow = pos.row + dr * (k + 1);
      const afterCol = pos.col + dc * (k + 1);
      if (!inBounds(afterRow, afterCol) || board[afterRow][afterCol] !== null) break;

      const capturedPos = { row, col };
      let m = k + 1;
      while (true) {
        const landRow = pos.row + dr * m;
        const landCol = pos.col + dc * m;
        if (!inBounds(landRow, landCol)) break;
        if (board[landRow][landCol] !== null) break;

        moves.push({ from: pos, to: { row: landRow, col: landCol }, captured: capturedPos });
        m += 1;
      }

      break;
    }
  }

  return moves;
}

export function legalMovesForPiece(board: Board, pos: Position): Move[] {
  const piece = board[pos.row]?.[pos.col];
  if (!piece) return [];

  return piece.king
    ? legalMovesForKing(board, pos, piece)
    : legalMovesForRegularPiece(board, pos, piece);
}

export function legalMovesForPlayer(board: Board, player: Owner): Move[] {
  const moves: Move[] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (piece?.owner === player) {
        moves.push(...legalMovesForPiece(board, { row, col }));
      }
    }
  }

  return moves;
}

export function applyMove(board: Board, move: Move): Board {
  const nextBoard = board.map((row) => [...row]);
  const piece = nextBoard[move.from.row][move.from.col];
  if (!piece) return nextBoard;

  nextBoard[move.from.row][move.from.col] = null;
  if (move.captured) {
    nextBoard[move.captured.row][move.captured.col] = null;
  }

  const promoted = move.to.row === furthestRow(piece.owner);
  nextBoard[move.to.row][move.to.col] = {
    owner: piece.owner,
    king: piece.king || promoted,
  };

  return nextBoard;
}

function countPieces(board: Board, player: Owner): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell?.owner === player) count += 1;
    }
  }
  return count;
}

export function getWinner(board: Board, playerToMove: Owner): Owner | null {
  if (countPieces(board, playerToMove) === 0) return opponentOf(playerToMove);
  if (legalMovesForPlayer(board, playerToMove).length === 0) return opponentOf(playerToMove);
  return null;
}

import { describe, expect, it } from "vitest";
import {
  applyMove,
  createInitialBoard,
  getWinner,
  legalMovesForPiece,
  legalMovesForPlayer,
  type Board,
} from "./dama-engine";

function emptyBoard(): Board {
  return Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));
}

describe("createInitialBoard", () => {
  it("配置する駒数と行が正しい", () => {
    const board = createInitialBoard();
    let humanCount = 0;
    let cpuCount = 0;
    const humanRows = new Set<number>();
    const cpuRows = new Set<number>();

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const piece = board[row][col];
        if (piece?.owner === "human") {
          humanCount += 1;
          humanRows.add(row);
        }
        if (piece?.owner === "cpu") {
          cpuCount += 1;
          cpuRows.add(row);
        }
      }
    }

    expect(humanCount).toBe(12);
    expect(cpuCount).toBe(12);
    expect([...humanRows].sort()).toEqual([5, 6, 7]);
    expect([...cpuRows].sort()).toEqual([0, 1, 2]);
  });
});

describe("legalMovesForPiece（一般駒）", () => {
  it("前方にのみ移動でき、後方には移動できない", () => {
    const board = emptyBoard();
    board[4][3] = { owner: "human", king: false };

    const moves = legalMovesForPiece(board, { row: 4, col: 3 });

    expect(moves.length).toBe(2);
    expect(moves.every((move) => move.to.row === 3)).toBe(true);
  });

  it("捕獲可能でも他の駒の通常移動が合法手に含まれる（捕獲は任意）", () => {
    const board = emptyBoard();
    board[5][4] = { owner: "human", king: false };
    board[4][3] = { owner: "cpu", king: false };
    board[6][1] = { owner: "human", king: false };

    const moves = legalMovesForPlayer(board, "human");

    const captureMove = moves.find(
      (move) => move.from.row === 5 && move.from.col === 4 && move.captured !== null,
    );
    const simpleMoves = moves.filter((move) => move.from.row === 6 && move.from.col === 1);

    expect(captureMove).toBeDefined();
    expect(captureMove?.to).toEqual({ row: 3, col: 2 });
    expect(simpleMoves).toHaveLength(2);
    expect(simpleMoves.every((move) => move.captured === null)).toBe(true);
  });

  it("連続捕獲が可能な局面では1回目の捕獲後に同じ駒でさらに捕獲できる", () => {
    const board = emptyBoard();
    board[7][2] = { owner: "human", king: false };
    board[6][3] = { owner: "cpu", king: false };
    board[4][5] = { owner: "cpu", king: false };

    const firstMoves = legalMovesForPiece(board, { row: 7, col: 2 });
    const firstCapture = firstMoves.find((move) => move.captured !== null);
    expect(firstCapture).toBeDefined();
    expect(firstCapture?.to).toEqual({ row: 5, col: 4 });

    const boardAfterFirstCapture = applyMove(board, firstCapture!);
    const secondMoves = legalMovesForPiece(boardAfterFirstCapture, { row: 5, col: 4 });
    const secondCapture = secondMoves.find((move) => move.captured !== null);

    expect(secondCapture).toBeDefined();
    expect(secondCapture?.to).toEqual({ row: 3, col: 6 });
    expect(secondCapture?.captured).toEqual({ row: 4, col: 5 });
  });

  it("最奥列に到達するとkingに昇格する", () => {
    const board = emptyBoard();
    board[1][2] = { owner: "human", king: false };

    const moves = legalMovesForPiece(board, { row: 1, col: 2 });
    const moveToFurthestRow = moves.find((move) => move.to.row === 0);
    expect(moveToFurthestRow).toBeDefined();

    const nextBoard = applyMove(board, moveToFurthestRow!);
    expect(nextBoard[0][moveToFurthestRow!.to.col]?.king).toBe(true);
  });
});

describe("legalMovesForPiece（王）", () => {
  it("フライングキングとして複数マス先まで移動でき、複数の着地先候補がある", () => {
    const board = emptyBoard();
    board[4][3] = { owner: "human", king: true };

    const moves = legalMovesForPiece(board, { row: 4, col: 3 });

    expect(moves.some((move) => move.to.row === 1 && move.to.col === 0)).toBe(true);
    expect(moves.some((move) => move.to.row === 0 && move.to.col === 7)).toBe(true);
    expect(moves.every((move) => move.captured === null)).toBe(true);
    expect(moves.length).toBeGreaterThan(4);
  });

  it("捕獲後の着地先は空きマスの数だけ複数候補になる", () => {
    const board = emptyBoard();
    board[7][6] = { owner: "human", king: true };
    board[6][5] = { owner: "cpu", king: false };

    const moves = legalMovesForPiece(board, { row: 7, col: 6 });
    const captureMoves = moves.filter((move) => move.captured !== null);

    expect(captureMoves).toHaveLength(5);
    expect(captureMoves.map((move) => move.to)).toEqual(
      expect.arrayContaining([
        { row: 5, col: 4 },
        { row: 4, col: 3 },
        { row: 3, col: 2 },
        { row: 2, col: 1 },
        { row: 1, col: 0 },
      ]),
    );
    expect(captureMoves.every((move) => move.captured?.row === 6 && move.captured?.col === 5)).toBe(
      true,
    );
  });

  it("相手駒が2個連続で並ぶと飛び越えられず手前までしか進めない", () => {
    const board = emptyBoard();
    board[7][6] = { owner: "human", king: true };
    board[5][4] = { owner: "cpu", king: false };
    board[4][3] = { owner: "cpu", king: false };

    const moves = legalMovesForPiece(board, { row: 7, col: 6 });

    expect(moves.some((move) => move.to.row === 6 && move.to.col === 5)).toBe(true);
    expect(moves.some((move) => move.to.row === 3 && move.to.col === 2)).toBe(false);
    expect(moves.every((move) => move.captured === null)).toBe(true);
  });
});

describe("getWinner", () => {
  it("駒が0枚の場合は相手の勝ち", () => {
    const board = emptyBoard();
    board[0][1] = { owner: "cpu", king: false };

    expect(getWinner(board, "human")).toBe("cpu");
  });

  it("合法手が1つもない場合は相手の勝ち", () => {
    const board = emptyBoard();
    // row 0 は human の最奥列。非king駒がここに置かれると前方2方向とも盤外になり合法手0件になる。
    board[0][1] = { owner: "human", king: false };
    board[7][0] = { owner: "cpu", king: false };

    expect(legalMovesForPlayer(board, "human")).toHaveLength(0);
    expect(getWinner(board, "human")).toBe("cpu");
  });

  it("双方に合法手がある場合はnull", () => {
    const board = createInitialBoard();
    expect(getWinner(board, "human")).toBeNull();
  });
});

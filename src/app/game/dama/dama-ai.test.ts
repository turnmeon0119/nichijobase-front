import { describe, expect, it } from "vitest";
import { DIFFICULTIES } from "@/app/game/types";
import { chooseMove } from "./dama-ai";
import { legalMovesForPlayer, type Board } from "./dama-engine";

function emptyBoard(): Board {
  return Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));
}

describe("chooseMove", () => {
  it("ノーリスクで捕獲できる局面では全難易度で捕獲を選ぶ", () => {
    for (const difficulty of DIFFICULTIES) {
      const board = emptyBoard();
      board[2][3] = { owner: "cpu", king: false };
      board[3][4] = { owner: "human", king: false };
      board[1][0] = { owner: "cpu", king: false };

      const decision = chooseMove(board, "cpu", difficulty, { timeBudgetMs: 30 });

      expect(decision.type).toBe("move");
      if (decision.type === "move") {
        expect(decision.move.from).toEqual({ row: 2, col: 3 });
        expect(decision.move.to).toEqual({ row: 4, col: 5 });
        expect(decision.move.captured).toEqual({ row: 3, col: 4 });
      }
    }
  });

  it("chainingPiece指定時はmoveかstopのいずれかを正しく返す", () => {
    const board = emptyBoard();
    board[4][1] = { owner: "cpu", king: false };
    board[5][2] = { owner: "human", king: false };

    const decision = chooseMove(board, "cpu", "normal", {
      chainingPiece: { row: 4, col: 1 },
      timeBudgetMs: 30,
    });

    expect(["move", "stop"]).toContain(decision.type);
    if (decision.type === "move") {
      expect(decision.move.from).toEqual({ row: 4, col: 1 });
      expect(decision.move.captured).not.toBeNull();
    }
  });

  it("合法手が1つもない局面ではchooseMoveが例外を投げずstopを返す", () => {
    const board = emptyBoard();
    // row 7 は cpu の最奥列。非king駒がここに置かれると前方2方向とも盤外になり合法手0件になる。
    board[7][0] = { owner: "cpu", king: false };
    board[0][1] = { owner: "human", king: false };

    expect(legalMovesForPlayer(board, "cpu")).toHaveLength(0);
    expect(() => chooseMove(board, "cpu", "normal", { timeBudgetMs: 30 })).not.toThrow();
    expect(chooseMove(board, "cpu", "normal", { timeBudgetMs: 30 })).toEqual({ type: "stop" });
  });
});

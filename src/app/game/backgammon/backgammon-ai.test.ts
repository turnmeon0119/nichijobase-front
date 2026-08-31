import { describe, expect, it } from "vitest";
import { chooseMove } from "./backgammon-ai";
import { enumerateLegalSequences } from "./backgammon-engine";
import type { BoardState } from "./backgammon-engine";

function emptyBoard(): BoardState {
  return {
    points: Array.from({ length: 24 }, () => ({ owner: null, count: 0 })),
    bar: { human: 0, cpu: 0 },
    borneOff: { human: 0, cpu: 0 },
  };
}

describe("chooseMove", () => {
  it("picks the clearly better (hitting) sequence for hard and oni difficulties", () => {
    const state = emptyBoard();
    state.points[10] = { owner: "human", count: 1 }; // 10 -> 6, a quiet move
    state.points[8] = { owner: "human", count: 1 }; // 8 -> 4, hits the cpu blot
    state.points[4] = { owner: "cpu", count: 1 };

    const dice = [4];
    const candidates = enumerateLegalSequences(state, dice, "human");
    expect(candidates).toEqual(
      expect.arrayContaining([[{ from: 10, to: 6 }], [{ from: 8, to: 4 }]]),
    );

    const hardMove = chooseMove(state, dice, "human", "hard");
    const oniMove = chooseMove(state, dice, "human", "oni");

    expect(hardMove).toEqual([{ from: 8, to: 4 }]);
    expect(oniMove).toEqual([{ from: 8, to: 4 }]);
  });

  it("returns a legal candidate for normal difficulty even though the pick is randomized", () => {
    const state = emptyBoard();
    state.points[10] = { owner: "human", count: 1 };
    state.points[15] = { owner: "human", count: 1 };
    state.points[20] = { owner: "human", count: 1 };

    const dice = [4];
    const candidates = enumerateLegalSequences(state, dice, "human");

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const move = chooseMove(state, dice, "human", "normal");
      expect(candidates).toEqual(expect.arrayContaining([move]));
    }
  });

  it("returns an empty sequence when there is no legal move", () => {
    const state = emptyBoard();
    state.points[10] = { owner: "human", count: 1 };
    state.points[9] = { owner: "cpu", count: 2 }; // blocks die 1
    state.points[8] = { owner: "cpu", count: 2 }; // blocks die 2

    const move = chooseMove(state, [1, 2], "human", "hard");

    expect(move).toEqual([]);
  });
});

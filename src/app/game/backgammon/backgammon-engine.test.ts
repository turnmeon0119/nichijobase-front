import { describe, expect, it } from "vitest";
import {
  applySingleMove,
  createInitialBoard,
  enumerateLegalSequences,
  enumerateSingleLegalMoves,
  getWinner,
  reentryIndexOf,
} from "./backgammon-engine";
import type { BoardState, Player } from "./backgammon-engine";

function emptyBoard(): BoardState {
  return {
    points: Array.from({ length: 24 }, () => ({ owner: null, count: 0 })),
    bar: { human: 0, cpu: 0 },
    borneOff: { human: 0, cpu: 0 },
  };
}

function countCheckers(state: BoardState, player: Player): number {
  const onBoard = state.points.reduce((sum, point) => (point.owner === player ? sum + point.count : sum), 0);
  return onBoard + state.bar[player] + state.borneOff[player];
}

describe("createInitialBoard", () => {
  it("places 15 checkers for each player at the standard positions", () => {
    const state = createInitialBoard();

    expect(countCheckers(state, "human")).toBe(15);
    expect(countCheckers(state, "cpu")).toBe(15);

    expect(state.points[23]).toEqual({ owner: "human", count: 2 });
    expect(state.points[12]).toEqual({ owner: "human", count: 5 });
    expect(state.points[7]).toEqual({ owner: "human", count: 3 });
    expect(state.points[5]).toEqual({ owner: "human", count: 5 });
    expect(state.points[0]).toEqual({ owner: "cpu", count: 2 });
    expect(state.points[11]).toEqual({ owner: "cpu", count: 5 });
    expect(state.points[16]).toEqual({ owner: "cpu", count: 3 });
    expect(state.points[18]).toEqual({ owner: "cpu", count: 5 });
  });
});

describe("applySingleMove", () => {
  it("moves a checker to an empty point without mutating the source state", () => {
    const state = emptyBoard();
    state.points[10] = { owner: "human", count: 1 };

    const next = applySingleMove(state, { from: 10, to: 7 }, "human");

    expect(next.points[10]).toEqual({ owner: null, count: 0 });
    expect(next.points[7]).toEqual({ owner: "human", count: 1 });
    expect(state.points[10]).toEqual({ owner: "human", count: 1 });
    expect(state.points[7]).toEqual({ owner: null, count: 0 });
  });

  it("hits a lone opponent checker and sends it to the bar", () => {
    const state = emptyBoard();
    state.points[10] = { owner: "human", count: 1 };
    state.points[7] = { owner: "cpu", count: 1 };

    const next = applySingleMove(state, { from: 10, to: 7 }, "human");

    expect(next.points[7]).toEqual({ owner: "human", count: 1 });
    expect(next.bar.cpu).toBe(1);
  });

  it("does not hit a point occupied by two or more opponent checkers", () => {
    const state = emptyBoard();
    state.points[10] = { owner: "human", count: 1 };
    state.points[7] = { owner: "cpu", count: 2 };

    const moves = enumerateSingleLegalMoves(state, 3, "human");

    expect(moves).toEqual([]);
  });
});

describe("bar re-entry", () => {
  it("computes the human re-entry index as 24 - die", () => {
    expect(reentryIndexOf(1, "human")).toBe(23);
    expect(reentryIndexOf(6, "human")).toBe(18);
  });

  it("computes the cpu re-entry index as die - 1", () => {
    expect(reentryIndexOf(1, "cpu")).toBe(0);
    expect(reentryIndexOf(6, "cpu")).toBe(5);
  });

  it("only allows re-entry moves while a checker is on the bar", () => {
    const state = emptyBoard();
    state.bar.human = 1;
    state.points[9] = { owner: "human", count: 1 };

    const moves = enumerateSingleLegalMoves(state, 3, "human");

    expect(moves).toEqual([{ from: "bar", to: 21 }]);
  });

  it("excludes sequences that move other checkers before the bar checker re-enters", () => {
    const state = emptyBoard();
    state.bar.human = 1;
    state.points[9] = { owner: "human", count: 1 };

    const sequences = enumerateLegalSequences(state, [6, 3], "human");

    expect(sequences.length).toBeGreaterThan(0);
    sequences.forEach((sequence) => {
      expect(sequence[0]?.from).toBe("bar");
    });
  });
});

describe("bear off", () => {
  it("cannot bear off when not all checkers are home", () => {
    const state = emptyBoard();
    state.points[5] = { owner: "human", count: 1 }; // home, point number 6
    state.points[10] = { owner: "human", count: 1 }; // not home

    const moves = enumerateSingleLegalMoves(state, 6, "human");

    expect(moves.some((move) => move.to === "off")).toBe(false);
  });

  it("bears off exactly when the die equals the point number", () => {
    const state = emptyBoard();
    state.points[5] = { owner: "human", count: 1 }; // point number 6

    const moves = enumerateSingleLegalMoves(state, 6, "human");

    expect(moves).toContainEqual({ from: 5, to: "off" });
  });

  it("allows an oversized die to bear off the furthest checker only", () => {
    const state = emptyBoard();
    state.points[3] = { owner: "human", count: 1 }; // point number 4, the furthest checker
    state.points[1] = { owner: "human", count: 1 }; // point number 2

    const moves = enumerateSingleLegalMoves(state, 6, "human");

    expect(moves).toContainEqual({ from: 3, to: "off" });
    expect(moves.some((move) => move.from === 1 && move.to === "off")).toBe(false);
  });
});

describe("enumerateLegalSequences", () => {
  it("finds the full-length sequence even when only one die order works", () => {
    const state = emptyBoard();
    state.points[10] = { owner: "human", count: 1 };
    state.points[5] = { owner: "cpu", count: 2 }; // blocks the direct die-5 move (10 -> 5)

    const sequences = enumerateLegalSequences(state, [5, 3], "human");

    expect(sequences).toEqual([[{ from: 10, to: 7 }, { from: 7, to: 2 }]]);
  });

  it("returns every tied maximum-length sequence when only one die can ever be used", () => {
    const state = emptyBoard();
    state.points[10] = { owner: "human", count: 1 };
    state.points[5] = { owner: "cpu", count: 2 }; // both orders eventually land here and stop

    const sequences = enumerateLegalSequences(state, [1, 4], "human");

    const maxLength = Math.max(...sequences.map((sequence) => sequence.length));
    expect(maxLength).toBe(1);
    expect(sequences).toEqual(
      expect.arrayContaining([[{ from: 10, to: 9 }], [{ from: 10, to: 6 }]]),
    );
    expect(sequences).toHaveLength(2);
  });

  it("returns an empty array when there is no legal move at all", () => {
    const state = emptyBoard();
    state.points[10] = { owner: "human", count: 1 };
    state.points[9] = { owner: "cpu", count: 2 }; // blocks die 1
    state.points[8] = { owner: "cpu", count: 2 }; // blocks die 2

    const sequences = enumerateLegalSequences(state, [1, 2], "human");

    expect(sequences).toEqual([]);
  });
});

describe("getWinner", () => {
  it("declares a winner once all 15 checkers are borne off", () => {
    const state = emptyBoard();
    state.borneOff.human = 15;

    expect(getWinner(state)).toBe("human");
  });

  it("returns null while no player has finished", () => {
    const state = emptyBoard();
    state.borneOff.human = 14;
    state.borneOff.cpu = 10;

    expect(getWinner(state)).toBeNull();
  });
});

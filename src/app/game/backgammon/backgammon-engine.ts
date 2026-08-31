export type Player = "human" | "cpu";

export type Point = {
  owner: Player | null;
  count: number;
};

export type BoardState = {
  points: Point[];
  bar: { human: number; cpu: number };
  borneOff: { human: number; cpu: number };
};

export type SingleMove = {
  from: number | "bar";
  to: number | "off";
};

export type MoveSequence = SingleMove[];

const HUMAN_HOME_INDICES = [0, 1, 2, 3, 4, 5];
const CPU_HOME_INDICES = [18, 19, 20, 21, 22, 23];

export function opponentOf(player: Player): Player {
  return player === "human" ? "cpu" : "human";
}

export function directionOf(player: Player): 1 | -1 {
  return player === "human" ? -1 : 1;
}

export function pointNumberOf(idx: number, player: Player): number {
  return player === "human" ? idx + 1 : 24 - idx;
}

export function reentryIndexOf(die: number, player: Player): number {
  return player === "human" ? 24 - die : die - 1;
}

function homeIndicesOf(player: Player): number[] {
  return player === "human" ? HUMAN_HOME_INDICES : CPU_HOME_INDICES;
}

function emptyPoint(): Point {
  return { owner: null, count: 0 };
}

export function createInitialBoard(): BoardState {
  const points: Point[] = Array.from({ length: 24 }, emptyPoint);

  points[23] = { owner: "human", count: 2 };
  points[12] = { owner: "human", count: 5 };
  points[7] = { owner: "human", count: 3 };
  points[5] = { owner: "human", count: 5 };
  points[0] = { owner: "cpu", count: 2 };
  points[11] = { owner: "cpu", count: 5 };
  points[16] = { owner: "cpu", count: 3 };
  points[18] = { owner: "cpu", count: 5 };

  return {
    points,
    bar: { human: 0, cpu: 0 },
    borneOff: { human: 0, cpu: 0 },
  };
}

function canLandOn(point: Point, player: Player): boolean {
  return point.owner === null || point.owner === player || point.count === 1;
}

function isAllCheckersHome(state: BoardState, player: Player): boolean {
  if (state.bar[player] > 0) return false;

  const home = homeIndicesOf(player);

  return state.points.every((point, idx) => point.owner !== player || home.includes(idx));
}

function maxHomePointNumber(state: BoardState, player: Player): number {
  const home = homeIndicesOf(player);

  return home.reduce((max, idx) => {
    const point = state.points[idx];
    if (point.owner !== player || point.count === 0) return max;
    return Math.max(max, pointNumberOf(idx, player));
  }, 0);
}

export function enumerateSingleLegalMoves(state: BoardState, die: number, player: Player): SingleMove[] {
  if (state.bar[player] > 0) {
    const to = reentryIndexOf(die, player);
    if (canLandOn(state.points[to], player)) {
      return [{ from: "bar", to }];
    }
    return [];
  }

  const moves: SingleMove[] = [];
  const direction = directionOf(player);

  state.points.forEach((point, from) => {
    if (point.owner !== player || point.count === 0) return;

    const to = from + direction * die;
    if (to >= 0 && to <= 23 && canLandOn(state.points[to], player)) {
      moves.push({ from, to });
    }
  });

  if (isAllCheckersHome(state, player)) {
    const home = homeIndicesOf(player);
    const maxPoint = maxHomePointNumber(state, player);

    home.forEach((idx) => {
      const point = state.points[idx];
      if (point.owner !== player || point.count === 0) return;

      const p = pointNumberOf(idx, player);
      if (die === p || (die > p && p === maxPoint)) {
        moves.push({ from: idx, to: "off" });
      }
    });
  }

  return moves;
}

export function applySingleMove(state: BoardState, move: SingleMove, player: Player): BoardState {
  const points = state.points.map((point) => ({ ...point }));
  const bar = { ...state.bar };
  const borneOff = { ...state.borneOff };

  if (move.from === "bar") {
    bar[player] -= 1;
  } else {
    const source = points[move.from];
    const nextCount = source.count - 1;
    points[move.from] = nextCount === 0 ? emptyPoint() : { owner: player, count: nextCount };
  }

  if (move.to === "off") {
    borneOff[player] += 1;
  } else {
    const target = points[move.to];
    if (target.owner !== null && target.owner !== player) {
      bar[opponentOf(player)] += 1;
      points[move.to] = { owner: player, count: 1 };
    } else {
      points[move.to] = { owner: player, count: target.count + 1 };
    }
  }

  return { points, bar, borneOff };
}

function removeOneValue(values: number[], value: number): number[] {
  const index = values.indexOf(value);
  return [...values.slice(0, index), ...values.slice(index + 1)];
}

function enumerateSequencesRecursive(
  state: BoardState,
  remainingDice: number[],
  player: Player,
  sequenceSoFar: MoveSequence,
  results: MoveSequence[],
): void {
  if (remainingDice.length === 0) {
    results.push(sequenceSoFar);
    return;
  }

  const uniqueDieValues = Array.from(new Set(remainingDice));
  let anyMoveMade = false;

  uniqueDieValues.forEach((die) => {
    const singleMoves = enumerateSingleLegalMoves(state, die, player);

    singleMoves.forEach((move) => {
      anyMoveMade = true;
      const nextState = applySingleMove(state, move, player);
      const nextDice = removeOneValue(remainingDice, die);
      enumerateSequencesRecursive(nextState, nextDice, player, [...sequenceSoFar, move], results);
    });
  });

  if (!anyMoveMade) {
    results.push(sequenceSoFar);
  }
}

export function enumerateLegalSequences(state: BoardState, dice: number[], player: Player): MoveSequence[] {
  const results: MoveSequence[] = [];
  enumerateSequencesRecursive(state, dice, player, [], results);

  if (results.length === 0) return [];

  const maxLength = Math.max(...results.map((sequence) => sequence.length));
  if (maxLength === 0) return [];

  const seen = new Set<string>();
  const deduped: MoveSequence[] = [];

  results
    .filter((sequence) => sequence.length === maxLength)
    .forEach((sequence) => {
      const key = JSON.stringify(sequence);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(sequence);
      }
    });

  return deduped;
}

export function applySequence(state: BoardState, sequence: MoveSequence, player: Player): BoardState {
  return sequence.reduce((current, move) => applySingleMove(current, move, player), state);
}

export function getWinner(state: BoardState): Player | null {
  if (state.borneOff.human === 15) return "human";
  if (state.borneOff.cpu === 15) return "cpu";
  return null;
}

export function pipCount(state: BoardState, player: Player): number {
  const onBoard = state.points.reduce((sum, point, idx) => {
    if (point.owner !== player) return sum;
    return sum + point.count * pointNumberOf(idx, player);
  }, 0);

  return onBoard + state.bar[player] * 25;
}

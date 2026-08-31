import type { Difficulty } from "@/app/game/types";
import { applyMove, legalMovesForPiece, legalMovesForPlayer } from "./dama-engine";
import type { Board, Move, Owner, Position } from "./dama-engine";

export type Decision = { type: "move"; move: Move } | { type: "stop" };

type ChooseMoveOptions = {
  chainingPiece?: Position;
  timeBudgetMs?: number;
};

const DEFAULT_TIME_BUDGET_MS: Record<Difficulty, number> = {
  normal: 250,
  hard: 600,
  oni: 1200,
};

const MAX_DEPTH = 12;
const WIN_SCORE = 1000;

class SearchTimeout extends Error {}

function opponentOf(owner: Owner): Owner {
  return owner === "human" ? "cpu" : "human";
}

function decisionsFor(board: Board, player: Owner, chainingPiece: Position | null): Decision[] {
  if (chainingPiece) {
    const captures = legalMovesForPiece(board, chainingPiece).filter((move) => move.captured !== null);
    return [...captures.map((move): Decision => ({ type: "move", move })), { type: "stop" }];
  }

  return legalMovesForPlayer(board, player).map((move): Decision => ({ type: "move", move }));
}

function applyDecision(
  board: Board,
  player: Owner,
  decision: Decision,
): { board: Board; nextPlayer: Owner; nextChaining: Position | null } {
  if (decision.type === "stop") {
    return { board, nextPlayer: opponentOf(player), nextChaining: null };
  }

  const nextBoard = applyMove(board, decision.move);
  if (decision.move.captured) {
    const canContinue = legalMovesForPiece(nextBoard, decision.move.to).some(
      (move) => move.captured !== null,
    );
    if (canContinue) {
      return { board: nextBoard, nextPlayer: player, nextChaining: decision.move.to };
    }
  }

  return { board: nextBoard, nextPlayer: opponentOf(player), nextChaining: null };
}

function evaluate(board: Board, forPlayer: Owner): number {
  let score = 0;

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const piece = board[row][col];
      if (!piece) continue;

      const value = piece.king ? 3 : 1;
      const advancement = piece.king ? 0 : (piece.owner === "human" ? 7 - row : row) * 0.05;
      const sign = piece.owner === forPlayer ? 1 : -1;
      score += sign * (value + advancement);
    }
  }

  return score;
}

function search(
  board: Board,
  player: Owner,
  chainingPiece: Position | null,
  depth: number,
  alpha: number,
  beta: number,
  rootPlayer: Owner,
  deadline: number,
): number {
  if (performance.now() >= deadline) throw new SearchTimeout();

  const decisions = decisionsFor(board, player, chainingPiece);

  if (decisions.length === 0) {
    return player === rootPlayer ? -WIN_SCORE : WIN_SCORE;
  }

  if (depth <= 0) {
    return evaluate(board, rootPlayer);
  }

  const maximizing = player === rootPlayer;
  let value = maximizing ? -Infinity : Infinity;
  let currentAlpha = alpha;
  let currentBeta = beta;

  for (const decision of decisions) {
    const { board: nextBoard, nextPlayer, nextChaining } = applyDecision(board, player, decision);
    const childValue = search(
      nextBoard,
      nextPlayer,
      nextChaining,
      depth - 1,
      currentAlpha,
      currentBeta,
      rootPlayer,
      deadline,
    );

    if (maximizing) {
      value = Math.max(value, childValue);
      currentAlpha = Math.max(currentAlpha, value);
    } else {
      value = Math.min(value, childValue);
      currentBeta = Math.min(currentBeta, value);
    }

    if (currentBeta <= currentAlpha) break;
  }

  return value;
}

function searchRoot(
  board: Board,
  player: Owner,
  rootDecisions: Decision[],
  depth: number,
  deadline: number,
): Decision {
  let alpha = -Infinity;
  const beta = Infinity;
  let best = rootDecisions[0];
  let bestValue = -Infinity;

  for (const decision of rootDecisions) {
    const { board: nextBoard, nextPlayer, nextChaining } = applyDecision(board, player, decision);
    const value = search(nextBoard, nextPlayer, nextChaining, depth - 1, alpha, beta, player, deadline);

    if (value > bestValue) {
      bestValue = value;
      best = decision;
    }
    alpha = Math.max(alpha, value);
  }

  return best;
}

export function chooseMove(
  board: Board,
  player: Owner,
  difficulty: Difficulty,
  options?: ChooseMoveOptions,
): Decision {
  const chainingPiece = options?.chainingPiece ?? null;
  const rootDecisions = decisionsFor(board, player, chainingPiece);

  if (rootDecisions.length === 0) {
    return { type: "stop" };
  }

  const timeBudgetMs = options?.timeBudgetMs ?? DEFAULT_TIME_BUDGET_MS[difficulty];
  const deadline = performance.now() + timeBudgetMs;

  let bestDecision: Decision = rootDecisions[0];

  for (let depth = 2; depth <= MAX_DEPTH; depth += 1) {
    try {
      bestDecision = searchRoot(board, player, rootDecisions, depth, deadline);
    } catch (error) {
      if (error instanceof SearchTimeout) break;
      throw error;
    }

    if (performance.now() >= deadline) break;
  }

  return bestDecision;
}

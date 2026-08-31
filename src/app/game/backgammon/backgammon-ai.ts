import type { Difficulty } from "@/app/game/types";
import type { BoardState, MoveSequence, Player } from "./backgammon-engine";
import { applySequence, enumerateLegalSequences, opponentOf, pipCount } from "./backgammon-engine";

function evaluate(state: BoardState, forPlayer: Player, riskWeight: number): number {
  const opponent = opponentOf(forPlayer);
  const ownPip = pipCount(state, forPlayer);
  const oppPip = pipCount(state, opponent);

  let ownBlots = 0;
  let ownMadePoints = 0;

  state.points.forEach((point) => {
    if (point.owner !== forPlayer) return;
    if (point.count === 1) ownBlots += 1;
    if (point.count >= 2) ownMadePoints += 1;
  });

  return (
    oppPip -
    ownPip +
    ownMadePoints * 3 -
    ownBlots * riskWeight -
    state.bar[forPlayer] * 20 +
    state.bar[opponent] * 20 +
    state.borneOff[forPlayer] * 10 -
    state.borneOff[opponent] * 10
  );
}

export function chooseMove(state: BoardState, dice: number[], player: Player, difficulty: Difficulty): MoveSequence {
  const candidates = enumerateLegalSequences(state, dice, player);
  if (candidates.length === 0) return [];

  const riskWeight = difficulty === "oni" ? 12 : 6;

  const scored = candidates
    .map((sequence) => ({
      sequence,
      score: evaluate(applySequence(state, sequence, player), player, riskWeight),
    }))
    .sort((a, b) => b.score - a.score);

  if (difficulty === "normal") {
    const poolSize = Math.max(1, Math.ceil(scored.length / 2));
    const pool = scored.slice(0, poolSize);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return pick.sequence;
  }

  return scored[0].sequence;
}

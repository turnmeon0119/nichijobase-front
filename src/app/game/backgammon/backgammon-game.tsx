"use client";

import { useEffect, useState } from "react";
import { DIFFICULTIES, DIFFICULTY_LABEL } from "@/app/game/types";
import type { Difficulty } from "@/app/game/types";
import RulebookPanel from "@/app/game/rulebook-panel";
import BackgammonBoard from "./backgammon-board";
import type { BoardSelection } from "./backgammon-board";
import BackgammonRules from "./backgammon-rules";
import { applySingleMove, createInitialBoard, enumerateLegalSequences, getWinner, opponentOf } from "./backgammon-engine";
import type { BoardState, MoveSequence, Player, SingleMove } from "./backgammon-engine";
import { chooseMove } from "./backgammon-ai";

type Phase = "setup" | "playing" | "finished";

type TurnState = {
  player: Player;
  diceRolled: [number, number];
  expandedDice: number[];
  candidates: MoveSequence[];
  playedMoves: SingleMove[];
};

function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

function rollTwoDice(): [number, number] {
  return [rollDie(), rollDie()];
}

function expandDice([a, b]: [number, number]): number[] {
  return a === b ? [a, a, a, a] : [a, b];
}

function sameMove(a: SingleMove, b: SingleMove): boolean {
  return a.from === b.from && a.to === b.to;
}

function DiceFace({ value }: { value: number }) {
  return (
    <span className="grid size-10 place-items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-lg font-bold shadow-sm sm:size-12">
      {value}
    </span>
  );
}

export default function BackgammonGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [phase, setPhase] = useState<Phase>("setup");
  const [board, setBoard] = useState<BoardState>(() => createInitialBoard());
  const [turn, setTurn] = useState<TurnState | null>(null);
  const [selectedFrom, setSelectedFrom] = useState<number | "bar" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  function startTurn(nextBoard: BoardState, player: Player, diceRolled: [number, number]) {
    const expandedDice = expandDice(diceRolled);
    const candidates = enumerateLegalSequences(nextBoard, expandedDice, player);

    setBoard(nextBoard);
    setSelectedFrom(null);
    setTurn({ player, diceRolled, expandedDice, candidates, playedMoves: [] });
    setMessage(candidates.length === 0 ? `${player === "human" ? "自分" : "CPU"}は打てる手がないためパスします` : null);
  }

  function startGame() {
    let humanRoll = rollDie();
    let cpuRoll = rollDie();
    while (humanRoll === cpuRoll) {
      humanRoll = rollDie();
      cpuRoll = rollDie();
    }
    const startingPlayer: Player = humanRoll > cpuRoll ? "human" : "cpu";
    const initialBoard = createInitialBoard();

    setWinner(null);
    setPhase("playing");
    startTurn(initialBoard, startingPlayer, [humanRoll, cpuRoll]);
    setMessage(
      `先手決め: 自分 ${humanRoll} / CPU ${cpuRoll} → ${startingPlayer === "human" ? "自分" : "CPU"}が先手です`,
    );
  }

  function resetToSetup() {
    setPhase("setup");
    setTurn(null);
    setWinner(null);
    setMessage(null);
    setSelectedFrom(null);
    setBoard(createInitialBoard());
  }

  function finishOrAdvance(nextBoard: BoardState, finishedPlayer: Player) {
    const win = getWinner(nextBoard);
    if (win) {
      setBoard(nextBoard);
      setWinner(win);
      setPhase("finished");
      setTurn(null);
      return;
    }
    startTurn(nextBoard, opponentOf(finishedPlayer), rollTwoDice());
  }

  function commitHumanMove(move: SingleMove) {
    if (!turn) return;

    const nextBoard = applySingleMove(board, move, "human");
    const nextPlayedMoves = [...turn.playedMoves, move];
    const totalMoves = turn.candidates[0]?.length ?? 0;

    setBoard(nextBoard);
    setSelectedFrom(null);

    if (nextPlayedMoves.length >= totalMoves) {
      finishOrAdvance(nextBoard, "human");
    } else {
      setTurn({ ...turn, playedMoves: nextPlayedMoves });
    }
  }

  // Auto-advance a turn that has zero legal sequences (a forced pass).
  useEffect(() => {
    if (phase !== "playing" || winner || !turn) return;
    if (turn.candidates.length !== 0) return;

    const timer = window.setTimeout(() => {
      startTurn(board, opponentOf(turn.player), rollTwoDice());
    }, 900);

    return () => window.clearTimeout(timer);
  }, [turn, phase, winner, board]);

  // Run the CPU's turn once it has legal moves to make.
  useEffect(() => {
    if (phase !== "playing" || winner || !turn) return;
    if (turn.player !== "cpu" || turn.candidates.length === 0) return;

    setIsCpuThinking(true);
    const timer = window.setTimeout(() => {
      const sequence = chooseMove(board, turn.expandedDice, "cpu", difficulty);
      const nextBoard = sequence.reduce((state, move) => applySingleMove(state, move, "cpu"), board);
      setIsCpuThinking(false);
      finishOrAdvance(nextBoard, "cpu");
    }, 700);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, phase, winner, board, difficulty]);

  const isHumanTurnActive = phase === "playing" && !winner && turn?.player === "human" && turn.candidates.length > 0;
  const nextMoveIndex = turn?.playedMoves.length ?? 0;
  const activeCandidates = turn
    ? turn.candidates.filter((sequence) => turn.playedMoves.every((move, i) => sameMove(sequence[i], move)))
    : [];
  const nextOptions = activeCandidates.map((sequence) => sequence[nextMoveIndex]).filter((move): move is SingleMove => Boolean(move));

  const boardSelection: BoardSelection = isHumanTurnActive
    ? {
        selectedFrom,
        selectableFrom: Array.from(new Set(nextOptions.map((move) => move.from))),
        selectableTo:
          selectedFrom === null
            ? []
            : nextOptions.filter((move) => move.from === selectedFrom).map((move) => move.to),
      }
    : { selectedFrom: null, selectableFrom: [], selectableTo: [] };

  function handleSelectPoint(point: number | "bar" | "off") {
    if (!isHumanTurnActive) return;

    if (selectedFrom === null) {
      if (boardSelection.selectableFrom.includes(point as number | "bar")) {
        setSelectedFrom(point as number | "bar");
      }
      return;
    }

    if (point === selectedFrom) {
      setSelectedFrom(null);
      return;
    }

    const match = nextOptions.find((move) => move.from === selectedFrom && move.to === point);
    if (match) {
      commitHumanMove(match);
    }
  }

  const statusText =
    message ??
    (turn
      ? turn.player === "cpu"
        ? isCpuThinking
          ? "CPU思考中..."
          : "CPUの番です"
        : "自分の番です。駒をタップして移動先を選んでください。"
      : null);

  return (
    <section className="mt-8 space-y-8">
      {phase === "setup" ? (
        <div className="paper-card rounded-[2rem] p-7 sm:p-10">
          <p className="editorial-label">Difficulty</p>
          <h2 className="display-font mt-3 text-3xl sm:text-4xl">難易度を選ぶ</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${
                  difficulty === level
                    ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
                    : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {DIFFICULTY_LABEL[level]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={startGame}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            対局を始める
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="paper-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 sm:p-6">
            <div>
              <p className="editorial-label">{DIFFICULTY_LABEL[difficulty]}・{turn?.player === "human" ? "自分の番" : "CPUの番"}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{statusText}</p>
            </div>
            {turn ? (
              <div className="flex items-center gap-2">
                <DiceFace value={turn.diceRolled[0]} />
                <DiceFace value={turn.diceRolled[1]} />
                {turn.diceRolled[0] === turn.diceRolled[1] ? (
                  <span className="text-xs font-semibold text-[var(--accent)]">×4</span>
                ) : null}
              </div>
            ) : null}
          </div>

          <BackgammonBoard board={board} selection={boardSelection} onSelectPoint={handleSelectPoint} />

          {phase === "finished" && winner ? (
            <div className="paper-card rounded-2xl p-7 text-center">
              <p className="editorial-label">Result</p>
              <h2 className="display-font mt-3 text-3xl">
                {winner === "human" ? "あなたの勝ちです" : "CPUの勝ちです"}
              </h2>
              <button
                type="button"
                onClick={resetToSetup}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent)]"
              >
                もう一度遊ぶ
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}
        </div>
      )}

      <RulebookPanel title="バックギャモンのルール">
        <BackgammonRules />
      </RulebookPanel>
    </section>
  );
}

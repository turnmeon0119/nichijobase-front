"use client";

import { useEffect, useState } from "react";
import RulebookPanel from "@/app/game/rulebook-panel";
import { DIFFICULTIES, DIFFICULTY_LABEL, type Difficulty } from "@/app/game/types";
import { chooseMove } from "./dama-ai";
import DamaBoard from "./dama-board";
import {
  applyMove,
  createInitialBoard,
  getWinner,
  legalMovesForPiece,
  type Board,
  type Move,
  type Owner,
  type Position,
} from "./dama-engine";
import DamaRules from "./dama-rules";

type Phase = "setup" | "playing" | "finished";

const CPU_THINK_DELAY_MS = 500;

function samePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export default function DamaGame() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [turn, setTurn] = useState<Owner>("human");
  const [selected, setSelected] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [chainingPiece, setChainingPiece] = useState<Position | null>(null);
  const [winner, setWinner] = useState<Owner | null>(null);

  const isCpuThinking = phase === "playing" && turn === "cpu" && !winner;

  useEffect(() => {
    if (phase !== "playing" || turn !== "cpu" || winner) return;

    const timeoutId = window.setTimeout(() => {
      let currentBoard = board;
      let chaining: Position | null = null;

      while (true) {
        const decision = chooseMove(
          currentBoard,
          "cpu",
          difficulty,
          chaining ? { chainingPiece: chaining } : undefined,
        );
        if (decision.type === "stop") break;

        currentBoard = applyMove(currentBoard, decision.move);

        if (decision.move.captured) {
          const canContinue = legalMovesForPiece(currentBoard, decision.move.to).some(
            (move) => move.captured !== null,
          );
          if (canContinue) {
            chaining = decision.move.to;
            continue;
          }
        }
        break;
      }

      setBoard(currentBoard);

      const result = getWinner(currentBoard, "human");
      if (result) {
        setWinner(result);
        setPhase("finished");
      } else {
        setTurn("human");
      }
    }, CPU_THINK_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [phase, turn, winner, board, difficulty]);

  function startGame(nextDifficulty: Difficulty) {
    setDifficulty(nextDifficulty);
    setBoard(createInitialBoard());
    setTurn("human");
    setSelected(null);
    setLegalMoves([]);
    setChainingPiece(null);
    setWinner(null);
    setPhase("playing");
  }

  function finalizeHumanTurn(nextBoard: Board) {
    setSelected(null);
    setLegalMoves([]);
    setChainingPiece(null);

    const result = getWinner(nextBoard, "cpu");
    if (result) {
      setWinner(result);
      setPhase("finished");
      return;
    }
    setTurn("cpu");
  }

  function applyHumanMove(move: Move) {
    const nextBoard = applyMove(board, move);
    setBoard(nextBoard);

    if (move.captured) {
      const furtherCaptures = legalMovesForPiece(nextBoard, move.to).filter(
        (candidate) => candidate.captured !== null,
      );
      if (furtherCaptures.length > 0) {
        setChainingPiece(move.to);
        setSelected(move.to);
        setLegalMoves(furtherCaptures);
        return;
      }
    }

    finalizeHumanTurn(nextBoard);
  }

  function handleSelectSquare(pos: Position) {
    if (phase !== "playing" || turn !== "human" || winner || isCpuThinking) return;

    const matchingMove = legalMoves.find((move) => samePosition(move.to, pos));

    if (chainingPiece) {
      if (matchingMove) applyHumanMove(matchingMove);
      return;
    }

    if (selected && matchingMove) {
      applyHumanMove(matchingMove);
      return;
    }

    const piece = board[pos.row][pos.col];
    if (piece?.owner === "human") {
      if (selected && samePosition(selected, pos)) {
        setSelected(null);
        setLegalMoves([]);
        return;
      }
      setSelected(pos);
      setLegalMoves(legalMovesForPiece(board, pos));
      return;
    }

    setSelected(null);
    setLegalMoves([]);
  }

  function endChain() {
    finalizeHumanTurn(board);
  }

  if (phase === "setup") {
    return (
      <section className="fade-up mt-10 border-t border-[var(--line)] pt-10">
        <p className="editorial-label">Difficulty</p>
        <h2 className="display-font mt-3 text-3xl leading-tight sm:text-4xl">難易度を選ぶ</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {DIFFICULTIES.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                difficulty === level
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
                  : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {DIFFICULTY_LABEL[level]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => startGame(difficulty)}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-7 py-4 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[var(--accent)]"
        >
          対局を始める
          <span aria-hidden="true">→</span>
        </button>

        <RulebookPanel title="ダマのルール">
          <DamaRules />
        </RulebookPanel>
      </section>
    );
  }

  return (
    <section className="fade-up mt-10 border-t border-[var(--line)] pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="editorial-label">Dama</p>
          <h2 className="display-font mt-2 text-3xl leading-tight sm:text-4xl">
            {DIFFICULTY_LABEL[difficulty]}モード
          </h2>
        </div>
        <p className="text-sm font-semibold text-[var(--muted)]">
          {phase === "finished"
            ? "対局終了"
            : isCpuThinking
              ? "CPU思考中..."
              : turn === "human"
                ? "あなたの手番です"
                : "CPUの手番です"}
        </p>
      </div>

      <div className="relative mt-8">
        <DamaBoard
          board={board}
          selected={selected}
          legalDestinations={legalMoves.map((move) => move.to)}
          onSelectSquare={handleSelectSquare}
          disabled={turn !== "human" || phase !== "playing"}
        />

        {phase === "finished" ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="paper-card w-full max-w-sm rounded-[2rem] p-8 text-center">
              <p className="editorial-label">Result</p>
              <h3 className="display-font mt-3 text-3xl">
                {winner === "human" ? "あなたの勝ち" : "CPUの勝ち"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {winner === "human"
                  ? "相手の駒を封じ込めました。"
                  : "動かせる駒がなくなってしまいました。"}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => startGame(difficulty)}
                  className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent)]"
                >
                  もう一度遊ぶ
                </button>
                <button
                  type="button"
                  onClick={() => setPhase("setup")}
                  className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-semibold text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  難易度を選び直す
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {chainingPiece ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--accent-soft)] p-4">
          <p className="text-sm font-semibold">続けて捕獲できます。続けますか?</p>
          <button
            type="button"
            onClick={endChain}
            className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-2 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            ここで手番を終える
          </button>
        </div>
      ) : null}

      <RulebookPanel title="ダマのルール">
        <DamaRules />
      </RulebookPanel>
    </section>
  );
}

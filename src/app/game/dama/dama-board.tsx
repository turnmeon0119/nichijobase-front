import { isPlayable } from "./dama-engine";
import type { Board, Position } from "./dama-engine";

type DamaBoardProps = {
  board: Board;
  selected: Position | null;
  legalDestinations: Position[];
  onSelectSquare: (pos: Position) => void;
  disabled?: boolean;
};

function isSamePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export default function DamaBoard({
  board,
  selected,
  legalDestinations,
  onSelectSquare,
  disabled = false,
}: DamaBoardProps) {
  return (
    <div className="paper-card mx-auto grid aspect-square w-full max-w-xl grid-cols-8 overflow-hidden rounded-[1.5rem] border border-[var(--line)]">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const pos: Position = { row: rowIndex, col: colIndex };
          const playable = isPlayable(pos);
          const isSelected = selected !== null && isSamePosition(selected, pos);
          const isDestination = legalDestinations.some((dest) => isSamePosition(dest, pos));

          if (!playable) {
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="bg-[var(--surface)]"
                aria-hidden="true"
              />
            );
          }

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSquare(pos)}
              aria-label={`${rowIndex + 1}行${colIndex + 1}列`}
              className={`relative flex items-center justify-center transition-colors ${
                isSelected
                  ? "bg-[color-mix(in_srgb,var(--accent)_35%,var(--foreground)_18%)]"
                  : "bg-[color-mix(in_srgb,var(--foreground)_18%,transparent)]"
              } disabled:cursor-default`}
            >
              {isDestination ? (
                <span
                  className="absolute size-[28%] rounded-full bg-[var(--accent)] opacity-70"
                  aria-hidden="true"
                />
              ) : null}

              {cell ? (
                <span
                  className={`relative flex size-[72%] items-center justify-center rounded-full border shadow-[0_4px_10px_rgba(54,45,34,0.25)] ${
                    cell.owner === "human"
                      ? "border-[var(--line)] bg-[var(--foreground)]"
                      : "border-[color-mix(in_srgb,var(--accent)_60%,var(--foreground)_10%)] bg-[var(--accent)]"
                  }`}
                >
                  {cell.king ? (
                    <span className="text-[0.9em] font-bold text-white">王</span>
                  ) : null}
                </span>
              ) : null}
            </button>
          );
        }),
      )}
    </div>
  );
}

import type { BoardState, Point } from "./backgammon-engine";

export type BoardSelection = {
  selectedFrom: number | "bar" | null;
  selectableFrom: (number | "bar")[];
  selectableTo: (number | "off")[];
};

type BackgammonBoardProps = {
  board: BoardState;
  selection: BoardSelection;
  onSelectPoint: (point: number | "bar" | "off") => void;
};

const TOP_LEFT = [12, 13, 14, 15, 16, 17];
const TOP_RIGHT = [18, 19, 20, 21, 22, 23];
const BOTTOM_LEFT = [11, 10, 9, 8, 7, 6];
const BOTTOM_RIGHT = [5, 4, 3, 2, 1, 0];

function CheckerStack({ point }: { point: Point }) {
  if (!point.owner || point.count === 0) return null;

  const displayCount = Math.min(point.count, 5);
  const colorClass =
    point.owner === "human" ? "bg-[var(--foreground)] text-[var(--surface)]" : "bg-[var(--accent)] text-white";

  return (
    <div className="flex flex-col items-center">
      {Array.from({ length: displayCount }).map((_, i) => {
        const isLast = i === displayCount - 1;
        const showOverflow = isLast && point.count > displayCount;

        return (
          <span
            key={i}
            style={{ marginTop: i === 0 ? 0 : "-0.6rem" }}
            className={`grid size-6 place-items-center rounded-full border border-[var(--line)] text-[10px] font-bold shadow-sm sm:size-7 ${colorClass}`}
          >
            {showOverflow ? point.count : ""}
          </span>
        );
      })}
    </div>
  );
}

type PointLaneProps = {
  idx: number;
  point: Point;
  column: number;
  row: number;
  isSelected: boolean;
  isSelectableFrom: boolean;
  isSelectableTo: boolean;
  onSelect: (point: number) => void;
};

function PointLane({ idx, point, column, row, isSelected, isSelectableFrom, isSelectableTo, onSelect }: PointLaneProps) {
  const clickable = isSelectableFrom || isSelectableTo;

  return (
    <button
      type="button"
      onClick={() => onSelect(idx)}
      disabled={!clickable}
      style={{ gridColumn: column, gridRow: row }}
      className={`flex min-h-24 flex-col items-center justify-start gap-1 rounded-xl border px-1 pb-2 pt-3 transition sm:min-h-32 ${
        isSelected
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : isSelectableTo
            ? "border-[var(--accent)] bg-[var(--accent-soft)] opacity-70"
            : "border-[var(--line)] bg-[var(--surface)]"
      } ${clickable ? "cursor-pointer hover:-translate-y-0.5" : "cursor-default"}`}
    >
      <CheckerStack point={point} />
    </button>
  );
}

type BarCellProps = {
  bar: { human: number; cpu: number };
  isSelectable: boolean;
  onSelect: (point: "bar") => void;
};

function BarCell({ bar, isSelectable, onSelect }: BarCellProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect("bar")}
      disabled={!isSelectable}
      style={{ gridColumn: 7, gridRow: "1 / span 2" }}
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border px-1 py-3 transition ${
        isSelectable
          ? "cursor-pointer border-[var(--accent)] bg-[var(--accent-soft)] hover:-translate-y-0.5"
          : "border-[var(--line)] bg-[var(--background)]"
      }`}
    >
      <p className="editorial-label text-[9px]">Bar</p>
      <CheckerStack point={{ owner: "cpu", count: bar.cpu }} />
      <CheckerStack point={{ owner: "human", count: bar.human }} />
    </button>
  );
}

type OffTrayProps = {
  label: string;
  count: number;
  colorClass: string;
  isSelectable: boolean;
  onSelect: (point: "off") => void;
};

function OffTray({ label, count, colorClass, isSelectable, onSelect }: OffTrayProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect("off")}
      disabled={!isSelectable}
      className={`flex w-14 flex-none flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-4 transition sm:w-20 ${
        isSelectable
          ? "cursor-pointer border-[var(--accent)] bg-[var(--accent-soft)] hover:-translate-y-0.5"
          : "border-[var(--line)] bg-[var(--surface)]"
      }`}
    >
      <p className="editorial-label text-center text-[9px] leading-tight">{label}</p>
      <span className={`display-font text-2xl ${colorClass}`}>{count}</span>
    </button>
  );
}

export default function BackgammonBoard({ board, selection, onSelectPoint }: BackgammonBoardProps) {
  const selectableFromSet = new Set(selection.selectableFrom);
  const selectableToSet = new Set(selection.selectableTo);

  const renderLane = (idx: number, column: number, row: number) => (
    <PointLane
      key={idx}
      idx={idx}
      point={board.points[idx]}
      column={column}
      row={row}
      isSelected={selection.selectedFrom === idx}
      isSelectableFrom={selectableFromSet.has(idx)}
      isSelectableTo={selectableToSet.has(idx)}
      onSelect={onSelectPoint}
    />
  );

  return (
    <div className="flex items-stretch gap-2 overflow-x-auto rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_18px_55px_rgba(54,45,34,0.05)] sm:gap-4 sm:p-6">
      <OffTray
        label="CPUの上がり"
        count={board.borneOff.cpu}
        colorClass="text-[var(--accent)]"
        isSelectable={false}
        onSelect={onSelectPoint}
      />

      <div
        className="grid flex-1 gap-1 sm:gap-2"
        style={{
          gridTemplateColumns: "repeat(6, minmax(2.2rem, 1fr)) minmax(2.5rem, 3.2rem) repeat(6, minmax(2.2rem, 1fr))",
          gridTemplateRows: "repeat(2, minmax(0, 1fr))",
        }}
      >
        {TOP_LEFT.map((idx, i) => renderLane(idx, i + 1, 1))}
        <BarCell bar={board.bar} isSelectable={selectableFromSet.has("bar")} onSelect={onSelectPoint} />
        {TOP_RIGHT.map((idx, i) => renderLane(idx, i + 8, 1))}
        {BOTTOM_LEFT.map((idx, i) => renderLane(idx, i + 1, 2))}
        {BOTTOM_RIGHT.map((idx, i) => renderLane(idx, i + 8, 2))}
      </div>

      <OffTray
        label="自分の上がり"
        count={board.borneOff.human}
        colorClass="text-[var(--foreground)]"
        isSelectable={selectableToSet.has("off")}
        onSelect={onSelectPoint}
      />
    </div>
  );
}

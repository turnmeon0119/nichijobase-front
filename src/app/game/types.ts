export type Difficulty = "normal" | "hard" | "oni";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  normal: "普通",
  hard: "難しい",
  oni: "鬼",
};

export const DIFFICULTIES: Difficulty[] = ["normal", "hard", "oni"];

export type GamePlayer = "human" | "cpu";

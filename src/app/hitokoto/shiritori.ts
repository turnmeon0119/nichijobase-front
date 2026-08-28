import { toHiragana } from "wanakana";
import kanjiFirstMora from "./kanji-first-mora.json";

const TRAILING_NOISE = /[\s、。！？!?…・"'「」『』（）()~〜.]+$/;
const KANJI_CHAR = /^[一-鿿㐀-䶿]$/;

// Derived from the Jōyō Kanji reading table (public MEXT list, machine-readable
// export via github.com/melissaboiko/joyodb): for each kanji, only the first
// character of each known on'yomi/kun'yomi reading is kept. A kanji can start
// several different readings (e.g. 留 → る/と/り), so matching below is
// permissive: any shared candidate sound counts as a shiritori continuation.
const KANJI_FIRST_MORA = kanjiFirstMora as Record<string, string[]>;

function normalize(text: string): string {
  // Folds katakana and romaji ("ru", "ル") down to hiragana ("る") so the same
  // sound matches regardless of script. Kanji pass through untouched.
  return toHiragana(text);
}

function lastMeaningfulChar(body: string): string | null {
  const trimmed = normalize(body).replace(TRAILING_NOISE, "");
  if (!trimmed) return null;

  const chars = Array.from(trimmed);
  return chars[chars.length - 1] ?? null;
}

function firstMeaningfulChar(body: string): string | null {
  const trimmed = normalize(body).trimStart();
  return Array.from(trimmed)[0] ?? null;
}

function candidateSounds(char: string | null): Set<string> {
  if (!char) return new Set();
  if (KANJI_CHAR.test(char)) return new Set(KANJI_FIRST_MORA[char] ?? []);
  return new Set([char]);
}

function soundsContinue(previousBody: string, nextBody: string): boolean {
  const endSounds = candidateSounds(lastMeaningfulChar(previousBody));
  const startSounds = candidateSounds(firstMeaningfulChar(nextBody));

  for (const sound of endSounds) {
    if (startSounds.has(sound)) return true;
  }
  return false;
}

export function getShiritoriHint(previousBody: string | null | undefined): string | null {
  if (!previousBody) return null;
  return lastMeaningfulChar(previousBody);
}

export type ComboTier = "warm" | "hot" | "max";

export function getComboTier(combo: number): ComboTier | null {
  if (combo >= 7) return "max";
  if (combo >= 4) return "hot";
  if (combo >= 2) return "warm";
  return null;
}

/**
 * postsNewestFirst is expected newest-first (as rendered). Returns each post's
 * streak length: 1 for a post that doesn't continue the previous one, N for the
 * Nth consecutive post whose reading could continue the previous post's ending
 * sound (kanji, hiragana, katakana, and romaji are all treated as equivalent).
 */
export function computeComboCounts(
  postsNewestFirst: { id: number; body: string }[],
): Map<number, number> {
  const chronological = [...postsNewestFirst].reverse();
  const combos = new Map<number, number>();

  let combo = 1;
  let previousBody: string | null = null;

  for (const post of chronological) {
    combo = previousBody !== null && soundsContinue(previousBody, post.body) ? combo + 1 : 1;
    combos.set(post.id, combo);
    previousBody = post.body;
  }

  return combos;
}

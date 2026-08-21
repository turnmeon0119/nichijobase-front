const STORAGE_KEY = "nichijobase:board-anonymous-name";

function createAnonymousName(): string {
  const code = Math.random().toString(16).slice(2, 6).toUpperCase().padEnd(4, "0");
  return `名無しさん-${code}`;
}

export function getOrCreateBoardName(): string {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const nextName = createAnonymousName();
  window.localStorage.setItem(STORAGE_KEY, nextName);
  return nextName;
}

export function saveBoardName(name: string): void {
  if (typeof window === "undefined") return;

  const trimmed = name.trim();
  if (!trimmed) return;

  window.localStorage.setItem(STORAGE_KEY, trimmed);
}

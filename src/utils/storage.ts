const readJson = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const storageKeys = {
  users: "law-game-user",
  session: "law-game-session",
  reports: "law-game-court-reports",
  history: "law-game-history",
  favorites: "law-game-favorites",
  scriptProgress: "law-game-script-progress",
};

export const storage = {
  readJson,
  writeJson,
  clearAll() {
    Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
  },
};

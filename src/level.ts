const LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type Level = (typeof LEVELS)[number];

/** Diff current level from target. */
export function diffLevel(target: Level, current: Level) {
  const targetLevel = LEVELS.findIndex(x => x === target);
  const currentLevel = LEVELS.findIndex(x => x === current);
  return currentLevel - targetLevel;
}

export function parseLevel(levelStr: string) {
  return LEVELS.find(x => x === levelStr.toLowerCase());
}

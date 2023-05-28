declare const LEVELS: readonly ["debug", "info", "warn", "error"];
export type Level = (typeof LEVELS)[number];
/** Diff current level from target. */
export declare function diffLevel(target: Level, current: Level): number;
export declare function parseLevel(levelStr: string): "debug" | "info" | "warn" | "error" | undefined;
export {};

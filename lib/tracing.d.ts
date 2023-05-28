import { type Level } from './level';
export declare function initTracing(scopeStr: string): import("./scope").Scope[];
declare class Tracer {
    readonly namespace?: string | undefined;
    constructor(namespace?: string | undefined);
    error(...args: any): void;
    warn(...args: any): void;
    info(...args: any): void;
    debug(...args: any): void;
    log(level: Level, ...args: any): void;
    private getScopes;
}
export declare function tracer(namespace?: string): Tracer;
export {};

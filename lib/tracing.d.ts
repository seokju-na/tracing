import { type Level } from './level';
import { type Scope } from './scope';
export declare function initTracing(scopeStr: string | Scope[]): Scope[];
interface TracerOptions {
    /** @default true */
    color?: boolean;
}
declare class Tracer {
    readonly namespace: string | undefined;
    private readonly options?;
    constructor(namespace: string | undefined, options?: TracerOptions | undefined);
    error(...args: any): void;
    warn(...args: any): void;
    info(...args: any): void;
    debug(...args: any): void;
    log(level: Level, ...args: any): void;
    private getScopes;
}
export declare function tracer(namespace?: string, options?: TracerOptions): Tracer;
export {};

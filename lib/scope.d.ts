import { type Level } from './level';
export interface Scope {
    pattern: string;
    level: Level;
}
/** Parse scopes from string */
export declare function parseScopes(scopeStr: string): Scope[];
export declare function findScopeLevel(scopes: Scope[], namespace: string): Level | undefined;

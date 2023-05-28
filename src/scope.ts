import { type Level, parseLevel } from './level';

export interface Scope {
  pattern: string;
  level: Level;
}

/** Parse scopes from string */
export function parseScopes(scopeStr: string): Scope[] {
  const scope: Scope[] = [];
  const values = scopeStr.split(',');
  for (const value of values) {
    if (value.includes('=')) {
      const [namespace, l] = value.split('=');
      const level = parseLevel(l ?? '');
      if (namespace !== undefined && level !== undefined) {
        scope.push({
          pattern: namespace.replaceAll('*', '.+'),
          level,
        });
      }
    } else {
      const level = parseLevel(value.trim());
      if (level !== undefined) {
        scope.push({ pattern: '.+', level });
      }
    }
  }
  return scope;
}

export function findScopeLevel(scopes: Scope[], namespace: string): Level | undefined {
  const scope = scopes.findLast(x => new RegExp(x.pattern).test(namespace));
  return scope?.level;
}

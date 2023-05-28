import { type Colorize, green, grey, red, yellow } from 'kleur/colors';
import { diffLevel, type Level } from './level';
import { findScopeLevel, parseScopes } from './scope';
import { getProcessEnv } from './node';

const colors: Record<Level, Colorize> = {
  error: red,
  warn: yellow,
  info: green,
  debug: grey,
};

export function initTracing(scopeStr: string) {
  const scopes = parseScopes(scopeStr);
  (console as any).__TRACING__ = scopes;
  return scopes;
}

class Tracer {
  constructor(public readonly namespace?: string) {}

  error(...args: any) {
    this.log('error', ...args);
  }

  warn(...args: any) {
    this.log('warn', ...args);
  }

  info(...args: any) {
    this.log('info', ...args);
  }

  debug(...args: any) {
    this.log('debug', ...args);
  }

  log(level: Level, ...args: any) {
    const scopes = this.getScopes();
    const targetLevel = findScopeLevel(scopes, this.namespace ?? 'anything') ?? 'debug';

    if (diffLevel(targetLevel, level) >= 0) {
      const prefix = colors[level](`[${this.namespace}:${level}]`);
      console.log(prefix, ...args);
    }
  }

  private getScopes() {
    const scopes = (console as any).__TRACING__;
    if (scopes !== undefined) {
      return scopes;
    }
    return initTracing(getProcessEnv('TRACING') ?? 'debug');
  }
}

export function tracer(namespace?: string) {
  return new Tracer(namespace);
}

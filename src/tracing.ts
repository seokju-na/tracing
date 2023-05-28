import { type Colorize, green, grey, red, yellow } from 'kleur/colors';
import { diffLevel, type Level } from './level';
import { findScopeLevel, parseScopes, type Scope } from './scope';
import { getProcessEnv } from './node';

export function initTracing(scopeStr: string | Scope[]) {
  const scopes = typeof scopeStr === 'string' ? parseScopes(scopeStr) : scopeStr;
  (console as any).__TRACING__ = scopes;
  return scopes;
}

const colors: Record<Level, Colorize> = {
  error: red,
  warn: yellow,
  info: green,
  debug: grey,
};

interface TracerOptions {
  /** @default true */
  color?: boolean;
}

class Tracer {
  constructor(public readonly namespace: string | undefined, private readonly options?: TracerOptions) {}

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
    const { color = true } = this.options ?? {};
    const scopes = this.getScopes();
    const targetLevel = findScopeLevel(scopes, this.namespace ?? 'anything') ?? 'debug';

    if (diffLevel(targetLevel, level) >= 0) {
      const prefixStr = `[${this.namespace ?? ''}:${level}]`;
      const prefix = color ? colors[level](prefixStr) : prefixStr;
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

export function tracer(namespace?: string, options?: TracerOptions) {
  return new Tracer(namespace, options);
}

import { describe, it, expect } from 'vitest';
import { parseScopes } from './scope';

describe('parseScopes', () => {
  it('parse scopes from string', () => {
    expect(parseScopes('debug,module-1=error,module-2=warn,http-*=info')).toEqual([
      { pattern: '.+', level: 'debug' },
      { pattern: 'module-1', level: 'error' },
      { pattern: 'module-2', level: 'warn' },
      { pattern: 'http-.+', level: 'info' },
    ]);
  });
});

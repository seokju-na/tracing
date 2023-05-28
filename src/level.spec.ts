import { describe, it, expect } from 'vitest';
import { diffLevel, parseLevel } from './level';

describe('diffLevel', () => {
  it('diff=0 if is same level', () => {
    expect(diffLevel('debug', 'debug')).toBe(0);
    expect(diffLevel('info', 'info')).toBe(0);
    expect(diffLevel('warn', 'warn')).toBe(0);
    expect(diffLevel('error', 'error')).toBe(0);
  });

  it('diff<0 if target level is more verbose', () => {
    expect(diffLevel('info', 'debug')).toBe(-1);
    expect(diffLevel('warn', 'debug')).toBe(-2);
    expect(diffLevel('error', 'debug')).toBe(-3);
  });

  it('diff>0 if current level is more verbose', () => {
    expect(diffLevel('debug', 'info')).toBe(1);
    expect(diffLevel('debug', 'warn')).toBe(2);
    expect(diffLevel('debug', 'error')).toBe(3);
  });
});

describe('parseLevel', () => {
  it('parse level from string', () => {
    expect(parseLevel('DEBUG')).toBe('debug');
    expect(parseLevel('Debug')).toBe('debug');
    expect(parseLevel('INFO')).toBe('info');
    expect(parseLevel('unknown')).toBe(undefined);
  });
});

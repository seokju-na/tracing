import { describe, it, vi, expect } from 'vitest';
import { initTracing, tracer } from './tracing';

describe('tracer', () => {
  it('log namespace by scope', () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    initTracing('error,a-1=debug,b-*=warn');

    const log1 = tracer(undefined, { color: false });
    const log2 = tracer('a-1', { color: false });
    const log3 = tracer('a-2', { color: false });
    const log4 = tracer('b-000', { color: false });

    log1.debug('not logged');
    log1.error('logged1');
    log2.debug('logged2');
    log2.info('logged3');
    log3.debug('not logged');
    log3.error('logged4');
    log4.debug('not logged');
    log4.warn('logged5');
    log4.error('logged6');

    expect(consoleLog).toHaveBeenCalledTimes(6);
    expect(consoleLog).toHaveBeenNthCalledWith(1, '[:error]', 'logged1');
    expect(consoleLog).toHaveBeenNthCalledWith(2, '[a-1:debug]', 'logged2');
    expect(consoleLog).toHaveBeenNthCalledWith(3, '[a-1:info]', 'logged3');
    expect(consoleLog).toHaveBeenNthCalledWith(4, '[a-2:error]', 'logged4');
    expect(consoleLog).toHaveBeenNthCalledWith(5, '[b-000:warn]', 'logged5');
    expect(consoleLog).toHaveBeenNthCalledWith(6, '[b-000:error]', 'logged6');
  });
});

export const createLogger = (prefix: string = '') => ({
  info: (...args: any[]) => console.log('[Lucid]', prefix, ...args),
  debug: (...args: any[]) => console.debug('[Lucid]', prefix, ...args),
  warn: (...args: any[]) => console.trace('[Lucid]', prefix, ...args),
  trace: (...args: any[]) => console.trace('[Lucid]', prefix, ...args),
  error: (...args: any[]) => console.error('[Lucid]', prefix, ...args),
});

export const logger = createLogger();

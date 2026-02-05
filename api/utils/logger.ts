/**
 * Logger factory: single implementation, each layer gets a scoped logger.
 * Lives under api/ so Vercel bundles it with serverless functions.
 * Usage: const log = createLogger('api/feed'); log.info('Request', { method });
 */

const PREFIX = '[LastMile]';

function ts(): string {
  return new Date().toISOString();
}

export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

function format(scope: string, level: string, message: string, meta?: Record<string, unknown>): void {
  const line = `${PREFIX} ${ts()} [${scope}] ${message}`;
  if (meta && Object.keys(meta).length) {
    if (level === 'error') console.error(line, meta);
    else if (level === 'warn') console.warn(line, meta);
    else console.log(line, meta);
  } else {
    if (level === 'error') console.error(line);
    else if (level === 'warn') console.warn(line);
    else console.log(line);
  }
}

/**
 * Returns a logger bound to the given scope (e.g. 'api/feed', 'discoveryMonitor').
 * Use one per module/layer; no copy-paste of logger logic.
 */
export function createLogger(scope: string): Logger {
  return {
    info(message: string, meta?: Record<string, unknown>) {
      format(scope, 'info', message, meta);
    },
    warn(message: string, meta?: Record<string, unknown>) {
      format(scope, 'warn', message, meta);
    },
    error(message: string, meta?: Record<string, unknown>) {
      format(scope, 'error', message, meta);
    },
  };
}

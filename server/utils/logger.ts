/**
 * Logger for server/API: stdout goes to Vercel function logs.
 * Scope + message only; no sensitive data.
 */
const PREFIX = '[LastMile]';

function ts(): string {
  return new Date().toISOString();
}

export const log = {
  info(scope: string, message: string, meta?: Record<string, unknown>) {
    if (Object.keys(meta ?? {}).length) console.log(`${PREFIX} ${ts()} [${scope}] ${message}`, meta);
    else console.log(`${PREFIX} ${ts()} [${scope}] ${message}`);
  },
  warn(scope: string, message: string, meta?: Record<string, unknown>) {
    if (Object.keys(meta ?? {}).length) console.warn(`${PREFIX} ${ts()} [${scope}] ${message}`, meta);
    else console.warn(`${PREFIX} ${ts()} [${scope}] ${message}`);
  },
  error(scope: string, message: string, meta?: Record<string, unknown>) {
    if (Object.keys(meta ?? {}).length) console.error(`${PREFIX} ${ts()} [${scope}] ${message}`, meta);
    else console.error(`${PREFIX} ${ts()} [${scope}] ${message}`);
  },
};

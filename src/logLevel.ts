import { atom } from "nanostores";

type LogLevel = "debug" | "error" | "none";

export const logLevelAtom = atom<LogLevel>("error");

/**
 * Set log level for Overwolf Nanostores. Should not set to `debug` on production.
 * None for no log even it's error.
 *
 * @param level The log level ('debug' | 'error' | 'none')
 */
export function setLogLevel(level: LogLevel) {
  logLevelAtom.set(level);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logError(...data: any[]) {
  const ll = logLevelAtom.get();
  if (ll === "error" || ll === "debug") {
    console.error(...data);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logDebug(...data: any[]) {
  if (logLevelAtom.get() === "debug") {
    console.log(...data);
  }
}

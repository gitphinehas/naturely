import { CONFIG } from '../config.js';

export class ApiError extends Error {
  constructor(message, kind = 'unknown') {
    super(message);
    this.kind = kind; // 'network' | 'http' | 'parse' | 'timeout'
  }
}

/** fetch mit Timeout, HTTP-Statusprüfung und JSON-Parsing. */
export async function fetchJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CONFIG.TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
  } catch (err) {
    throw err.name === 'AbortError'
      ? new ApiError('Die Anfrage hat zu lange gedauert.', 'timeout')
      : new ApiError('Der Dienst ist nicht erreichbar.', 'network');
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const msg = res.status === 429
      ? 'Zu viele Anfragen – bitte kurz warten.'
      : `Der Dienst meldet einen Fehler (HTTP ${res.status}).`;
    throw new ApiError(msg, 'http');
  }
  try {
    return await res.json();
  } catch {
    throw new ApiError('Die Antwort des Dienstes war ungültig.', 'parse');
  }
}

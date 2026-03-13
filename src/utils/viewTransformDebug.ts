/**
 * View transform diagnostic logger. Logs to console and keeps a ring buffer for inspection.
 *
 * Usage:
 * - In browser console: window.__viewTransformDebug.getLogs() to see recent VT events.
 * - Enable in production: add ?vt_debug=1 to the URL, or set window.__VIEW_TRANSFORM_DEBUG = true and reload.
 * - Tags: init:skip:hasParsedData | init:skip:createdKeys | init:adopt | init:create |
 *   create:start | create:response | create:error | parse:start | parse:done | parse:error |
 *   subscription:matched | fallback:fetch | buyerOps:suppliers | buyerOps:supplierLocations
 */
const MAX_LOGS = 150;

export type ViewTransformLogTag =
  | "init:skip:hasParsedData"
  | "init:skip:createdKeys"
  | "init:skip:cache"
  | "init:adopt"
  | "init:create"
  | "create:start"
  | "create:response"
  | "create:response:raw"
  | "create:error"
  | "create:blocked"
  | "create:inline-parse"
  | "create:inline-parse:error"
  | "parse:start"
  | "parse:done"
  | "parse:error"
  | "parse:bail:idChanged"
  | "parse:bail:unmounted"
  | "parse:signedUrl"
  | "subscription:matched"
  | "subscription:skip:parsing"
  | "fallback:fetch"
  | "timeout:loading"
  | "timeout:retry"
  | "timeout:retry:response"
  | "timeout:retry:error"
  | "timeout:retry:cache-hit"
  | "create:cross-instance-completed"
  | "hook:mount"
  | "hook:unmount"
  | "buyerOps:render"
  | "buyerOps:keyChange"
  | "buyerOps:suppliers"
  | "buyerOps:supplierLocations"
  | "buyerOps:clientFilter"
  | "buyerOps:clientAggregation";

export interface ViewTransformLogEntry {
  t: number;
  tag: ViewTransformLogTag;
  transformId: string;
  payload: Record<string, unknown>;
}

const ring: ViewTransformLogEntry[] = [];

function push(tag: ViewTransformLogTag, transformId: string, payload: Record<string, unknown>) {
  const entry: ViewTransformLogEntry = { t: Date.now(), tag, transformId, payload };
  ring.push(entry);
  if (ring.length > MAX_LOGS) ring.shift();
  const isDev =
    typeof window !== "undefined" &&
    process.env.NODE_ENV !== "test" &&
    (process.env.NODE_ENV === "development" ||
      (window as Window & { __VIEW_TRANSFORM_DEBUG?: boolean }).__VIEW_TRANSFORM_DEBUG ||
      (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("vt_debug") === "1"));
  if (isDev) {
    console.log(`[VT:${transformId}]`, tag, payload);
  }
}

export const viewTransformDebug = {
  log: push,
  getLogs(): ViewTransformLogEntry[] {
    return ring.slice();
  },
  clear(): void {
    ring.length = 0;
  },
};

declare global {
  interface Window {
    __viewTransformDebug?: typeof viewTransformDebug;
  }
}
if (typeof window !== "undefined") {
  window.__viewTransformDebug = viewTransformDebug;
}

export type DateLike = number | string | Date | null | undefined;

/**
 * First day of a given year as "MM/DD/YYYY".
 * Defaults to the current calendar year.
 */
export function currentYearStart(year?: number): string {
  const y = year ?? new Date().getFullYear()
  return `01/01/${y}`
}

/**
 * Last day of a given year as "MM/DD/YYYY".
 * Defaults to the current calendar year.
 */
export function currentYearEnd(year?: number): string {
  const y = year ?? new Date().getFullYear()
  return `12/31/${y}`
}

/**
 * Generate month column labels between two MM/DD/YY date strings.
 * Returns labels like "01/01/26", "02/01/26", etc.
 */
export function generateMonthColumns(fromStr: string, toStr: string): string[] {
  const cols: string[] = [];
  const [fM, , fY] = fromStr.split("/").map(Number);
  const [tM, , tY] = toStr.split("/").map(Number);
  let m = fM;
  let yFull = fY < 100 ? fY + 2000 : fY;
  const tFull = tY < 100 ? tY + 2000 : tY;
  while (yFull < tFull || (yFull === tFull && m <= tM)) {
    const mStr = String(m).padStart(2, "0");
    cols.push(`${mStr}/01/${String(yFull).slice(-2)}`);
    m++;
    if (m > 12) {
      m = 1;
      yFull++;
    }
  }
  return cols;
}

/**
 * Generate week column labels between two MM/DD/YY date strings.
 * Returns labels like "01/06/26", "01/13/26", etc. (7-day intervals).
 */
export function generateWeekColumns(fromStr: string, toStr: string): string[] {
  const cols: string[] = [];
  const [fM, fD, fY] = fromStr.split("/").map(Number);
  const [tM, tD, tY] = toStr.split("/").map(Number);
  const fYFull = fY < 100 ? fY + 2000 : fY;
  const tYFull = tY < 100 ? tY + 2000 : tY;
  const fromDate = new Date(fYFull, fM - 1, fD);
  const toDate = new Date(tYFull, tM - 1, tD);
  const current = new Date(fromDate);
  while (current <= toDate) {
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    const yy = String(current.getFullYear()).slice(-2);
    cols.push(`${mm}/${dd}/${yy}`);
    current.setDate(current.getDate() + 7);
  }
  return cols;
}

/**
 * Format a value as a UTC calendar date.
 * - Accepts epoch milliseconds, ISO strings, Date, or null/undefined.
 * - Returns '' for null/undefined/invalid values.
 */
export const formatUtcDate = (
  value: DateLike,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }
): string => {
  if (value === null || value === undefined) return "";

  let date: Date | null = null;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "number") {
    date = new Date(value);
  } else if (typeof value === "string") {
    const numValue = Number(value);
    if (!Number.isNaN(numValue) && numValue > 0) {
      date = new Date(numValue);
    } else {
      date = new Date(value);
    }
  }

  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "UTC",
  }).format(date);
};

/** Parse a short date string (MM/DD/YY or MM/DD/YYYY) to a Date object. */
export function parseShortDate(s: string): Date {
  const [m, d, y] = s.split("/").map(Number)
  return new Date(y < 100 ? 2000 + y : y, m - 1, d)
}

/** Convert an ISO date string ("YYYY-MM-DD") to a period bucket label ("MM/DD/YY"). */
export function dateToPeriod(dateStr: string, displayBy: string): string {
  const d = new Date(dateStr + "T00:00:00")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = String(d.getFullYear()).slice(2)
  if (displayBy === "Month") {
    return `${mm}/01/${yy}`
  }
  // Week — truncate to Monday
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  const wMm = String(monday.getMonth() + 1).padStart(2, "0")
  const wDd = String(monday.getDate()).padStart(2, "0")
  const wYy = String(monday.getFullYear()).slice(2)
  return `${wMm}/${wDd}/${wYy}`
}

/** Sort period strings ("MM/DD/YY") in chronological order. */
export function sortPeriods(periods: string[]): string[] {
  return [...periods].sort((a, b) => {
    const da = parseShortDate(a)
    const db = parseShortDate(b)
    return da.getTime() - db.getTime()
  })
}

/**
 * Convert a date value to ISO format (YYYY-MM-DD) in UTC for Python backend compatibility.
 *
 * Backend's dateStringToDaysSinceEpoch accepts ISO strings, MM-DD-YY, or timestamps.
 * ISO format (YYYY-MM-DD) is the most Python-friendly and unambiguous.
 * All dates are normalized to UTC to ensure consistent behavior across timezones.
 *
 * @param value - Date value (Date object, timestamp, ISO string, or null/undefined)
 * @returns ISO formatted date string (YYYY-MM-DD) in UTC, or null if invalid
 *
 * @example
 * ```typescript
 * formatDateToISO(new Date('2026-02-05T12:00:00Z')) // Returns "2026-02-05"
 * formatDateToISO(1704499200000) // Returns ISO string for that timestamp
 * formatDateToISO("2026-02-05") // Returns "2026-02-05"
 * formatDateToISO(null) // Returns null
 * ```
 */
export const formatDateToISO = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;

  // If already an ISO string (YYYY-MM-DD), return it (assumed to be UTC calendar date)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  let date: Date | null = null;

  if (value instanceof Date) {
    // Date object - use as-is (JavaScript Date is UTC internally)
    date = value;
  } else if (typeof value === "number" || typeof value === "bigint") {
    // Timestamp in milliseconds since epoch (UTC-based)
    date = new Date(Number(value));
  } else if (typeof value === "string") {
    // Try parsing as number first (timestamp in milliseconds)
    const numValue = Number(value);
    if (!Number.isNaN(numValue) && numValue > 0) {
      // Timestamp - treat as UTC milliseconds since epoch
      date = new Date(numValue);
    } else {
      // Date string - parse and treat as UTC calendar date
      date = new Date(value);
    }
  }

  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  // Format as ISO string (YYYY-MM-DD) using UTC components
  // This ensures the date represents a UTC calendar date, not a local timezone date
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

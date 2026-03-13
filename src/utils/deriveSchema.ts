import type { Table as ArrowTable, DataType } from "apache-arrow";
import type { ColumnProfile, CrossFilterOptions } from "../hooks/useSchema";

const CROSS_FILTER_CARDINALITY_LIMIT = 1000;

function arrowTypeName(dt: DataType): string {
  return dt.toString();
}

function toStringValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

/**
 * Derive ColumnProfile[] directly from an Arrow table, replacing the server-side
 * `get_schema` view transform. Computes unique values, min/max, null counts, and
 * cross-filter options for the specified filter columns.
 *
 * Performance: ~50-200ms for 182K rows / 7 filter columns.
 */
export function deriveColumnProfiles(
  arrowTable: ArrowTable,
  filterColumns: readonly string[],
): ColumnProfile[] {
  const numRows = arrowTable.numRows;
  const fields = arrowTable.schema.fields;
  const filterSet = new Set<string>(filterColumns);

  // --- Pass 1: per-column stats (unique values, min, max, nullCount) --------
  // Only collect unique values for columns that are in the filterColumns list.

  interface ColumnStats {
    name: string;
    type: string;
    min: number | null;
    max: number | null;
    nullCount: number;
    uniqueValues: Set<string> | null; // null = not a filter column
  }

  const statsByName = new Map<string, ColumnStats>();
  const statsArray: ColumnStats[] = [];

  for (const field of fields) {
    const isFilter = filterSet.has(field.name);
    const stats: ColumnStats = {
      name: field.name,
      type: arrowTypeName(field.type),
      min: null,
      max: null,
      nullCount: 0,
      uniqueValues: isFilter ? new Set<string>() : null,
    };
    statsByName.set(field.name, stats);
    statsArray.push(stats);
  }

  // Scan each filter column vector to build unique values + null count
  for (const colName of filterColumns) {
    const col = arrowTable.getChild(colName);
    const stats = statsByName.get(colName);
    if (!col || !stats || !stats.uniqueValues) continue;

    for (let i = 0; i < numRows; i++) {
      const v = col.get(i);
      if (v === null || v === undefined) {
        stats.nullCount++;
        continue;
      }
      const sv = toStringValue(v);
      if (colName === "EXCEPTION_CODES" && typeof v === "string" && v.includes(",")) {
        for (const part of v.split(",")) {
          const trimmed = part.trim();
          if (trimmed) stats.uniqueValues.add(trimmed);
        }
      } else {
        if (sv) stats.uniqueValues.add(sv);
      }
    }
  }

  // Scan non-filter columns for min/max and null counts only
  for (const field of fields) {
    if (filterSet.has(field.name)) continue; // already scanned above
    const col = arrowTable.getChild(field.name);
    const stats = statsByName.get(field.name);
    if (!col || !stats) continue;

    const typeStr = field.type.toString().toLowerCase();
    const isNumericLike =
      typeStr.includes("int") ||
      typeStr.includes("float") ||
      typeStr.includes("decimal") ||
      typeStr.includes("timestamp") ||
      typeStr.includes("date");

    for (let i = 0; i < numRows; i++) {
      const v = col.get(i);
      if (v === null || v === undefined) {
        stats.nullCount++;
        continue;
      }
      if (isNumericLike) {
        const n = Number(v);
        if (!isNaN(n)) {
          if (stats.min === null || n < stats.min) stats.min = n;
          if (stats.max === null || n > stats.max) stats.max = n;
        }
      }
    }
  }

  // Also compute min/max for filter columns that are numeric
  for (const colName of filterColumns) {
    const field = fields.find((f) => f.name === colName);
    if (!field) continue;
    const typeStr = field.type.toString().toLowerCase();
    const isNumericLike =
      typeStr.includes("int") ||
      typeStr.includes("float") ||
      typeStr.includes("decimal") ||
      typeStr.includes("timestamp") ||
      typeStr.includes("date");
    if (!isNumericLike) continue;

    const col = arrowTable.getChild(colName);
    const stats = statsByName.get(colName);
    if (!col || !stats) continue;

    for (let i = 0; i < numRows; i++) {
      const v = col.get(i);
      if (v === null || v === undefined) continue;
      const n = Number(v);
      if (!isNaN(n)) {
        if (stats.min === null || n < stats.min) stats.min = n;
        if (stats.max === null || n > stats.max) stats.max = n;
      }
    }
  }

  // --- Pass 2: cross-filter options for low-cardinality filter columns ------

  const lowCardCols = filterColumns.filter((c) => {
    const stats = statsByName.get(c);
    return stats?.uniqueValues && stats.uniqueValues.size <= CROSS_FILTER_CARDINALITY_LIMIT;
  });

  // crossMap[colA][colB][valA] → Set<valB>
  const crossMap = new Map<
    string,
    Map<string, Map<string, Set<string>>>
  >();

  for (const colA of lowCardCols) {
    const inner = new Map<string, Map<string, Set<string>>>();
    for (const colB of filterColumns) {
      if (colB === colA) continue;
      inner.set(colB, new Map());
    }
    crossMap.set(colA, inner);
  }

  if (lowCardCols.length > 0) {
    // Cache column vectors for the scan
    const colVectors = new Map<string, ReturnType<ArrowTable["getChild"]>>();
    for (const c of filterColumns) {
      colVectors.set(c, arrowTable.getChild(c));
    }

    for (let i = 0; i < numRows; i++) {
      // Read values for all filter columns once per row
      const rowVals = new Map<string, string>();
      for (const c of filterColumns) {
        const vec = colVectors.get(c);
        const v = vec?.get(i);
        rowVals.set(c, v != null ? toStringValue(v) : "");
      }

      for (const colA of lowCardCols) {
        const valA = rowVals.get(colA)!;
        if (!valA) continue;
        const innerA = crossMap.get(colA)!;

        for (const colB of filterColumns) {
          if (colB === colA) continue;
          const valB = rowVals.get(colB)!;
          if (!valB) continue;

          const bMap = innerA.get(colB)!;
          let bSet = bMap.get(valA);
          if (!bSet) {
            bSet = new Set<string>();
            bMap.set(valA, bSet);
          }

          if (colB === "EXCEPTION_CODES" && valB.includes(",")) {
            for (const part of valB.split(",")) {
              const trimmed = part.trim();
              if (trimmed) bSet.add(trimmed);
            }
          } else {
            bSet.add(valB);
          }
        }
      }
    }
  }

  // --- Build ColumnProfile[] -----------------------------------------------

  const profiles: ColumnProfile[] = [];

  for (const stats of statsArray) {
    const profile: ColumnProfile = {
      name: stats.name,
      type: stats.type,
      rowCount: numRows,
      nullCount: stats.nullCount,
    };

    if (stats.min !== null) profile.min = stats.min;
    if (stats.max !== null) profile.max = stats.max;

    if (stats.uniqueValues) {
      const sorted = Array.from(stats.uniqueValues).sort();
      profile.uniqueValues = sorted;
      profile.uniqueCount = sorted.length;
    }

    // Attach cross-filter options if this is a low-cardinality filter column
    const cMap = crossMap.get(stats.name);
    if (cMap) {
      const opts: CrossFilterOptions = {};
      for (const [otherCol, valMap] of cMap) {
        const colOpts: Record<string, string[]> = {};
        for (const [val, setOfVals] of valMap) {
          colOpts[val] = Array.from(setOfVals).sort();
        }
        opts[otherCol] = colOpts;
      }
      profile.crossFilterOptions = opts;
    }

    profiles.push(profile);
  }

  return profiles;
}

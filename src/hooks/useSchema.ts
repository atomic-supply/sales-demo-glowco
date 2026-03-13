import type { Table as ArrowTable } from "apache-arrow";
import { useMemo } from "react";
import { deriveColumnProfiles } from "../utils/deriveSchema";
import { useViewTransform } from "./useViewTransform";

/**
 * Cross-filter options mapping for a column.
 * Maps other column names to a dict of value -> valid values.
 *
 * Example for SUPPLIER_NAME column:
 * {
 *   "LOCATION_NAME": {
 *     "Acme Corp": ["Store 1", "Store 2"],
 *     "Beta Inc": ["Store 1", "Store 3"]
 *   },
 *   "EXCEPTION_CODES": {
 *     "Acme Corp": ["LOW_STOCK", "PRICE_CHANGE"]
 *   }
 * }
 */
export type CrossFilterOptions = Record<string, Record<string, string[]>>;

/**
 * Column profile statistics (computed by backend using Polars, or derived client-side from Arrow table)
 */
export interface ColumnProfile {
  /** Column name */
  name: string;
  /** Column data type (Arrow type string) */
  type: string;
  /** Min value (for numeric/date columns) */
  min?: number | Date | string | null;
  /** Max value (for numeric/date columns) */
  max?: number | Date | string | null;
  /** Unique values (for string columns) */
  uniqueValues?: string[];
  /** Number of unique values (for string columns) */
  uniqueCount?: number;
  /** Total number of rows */
  rowCount: number;
  /** Number of null values */
  nullCount: number;
  /**
   * Cross-filter options for cascading filter dropdowns.
   * Maps other filter column names to valid values based on this column's value.
   * Only populated for low-cardinality columns (< 1000 unique values).
   * High-cardinality columns like PRODUCT_CODE should be computed client-side.
   */
  crossFilterOptions?: CrossFilterOptions;
}

/**
 * Options for useSchema hook
 */
export interface UseSchemaOptions {
  /** Run settings JSON string */
  runSettings: string;
  /** Dataset name (e.g., 'atomic_purchase_order_plan') */
  datasetName: string;
  /** Folder to look for dataset in ('inputs', 'outputs', or 'settings') - default: 'outputs' */
  folder?: "inputs" | "outputs" | "settings";
  /** Organization ID - if not provided, will be fetched from user data */
  organizationId?: string;
  /** Whether to enable the hook (default: true) */
  enabled?: boolean;
  /** Filter columns to compute cross-filter options for (default: backend default) */
  filterColumns?: string[];
  /** When true, call viewtransforms GraphQL directly (bypasses backendgateway). */
  useDirectVT?: boolean;
  /**
   * When provided, derive schema client-side from this Arrow table instead of
   * calling the `get_schema` view transform. Eliminates 1 Lambda invocation,
   * 1 parquet download, and 1 AppSync subscription.
   */
  masterTable?: ArrowTable | null;
}

/**
 * Return type for useSchema hook
 */
export interface UseSchemaReturn {
  /** Column profiles with statistics */
  columnProfiles: ColumnProfile[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Total row count */
  rowCount: number;
  /** Column names */
  columns: string[];
}

/**
 * Hook for getting schema information for a dataset.
 *
 * Two modes:
 * 1. **Client-side derivation** (`masterTable` provided): Computes column profiles
 *    directly from the Arrow table (~50-200ms for 182K rows). No server call.
 * 2. **Server-side** (`masterTable` omitted): Uses the `get_schema` view transform
 *    to fetch pre-computed profiles from the backend.
 */
export function useSchema(options: UseSchemaOptions): UseSchemaReturn {
  const {
    runSettings,
    datasetName,
    folder = "outputs",
    organizationId,
    enabled = true,
    filterColumns,
    useDirectVT,
    masterTable,
  } = options;

  const useClientSide = masterTable !== undefined;

  // ── Client-side derivation path ───────────────────────────────────────────
  const clientProfiles = useMemo((): ColumnProfile[] => {
    if (!useClientSide || !masterTable || masterTable.numRows === 0) return [];
    return deriveColumnProfiles(masterTable, filterColumns ?? []);
  }, [useClientSide, masterTable, filterColumns]);

  const clientColumns = useMemo((): string[] => {
    if (!useClientSide || !masterTable) return [];
    return masterTable.schema.fields.map((f) => f.name);
  }, [useClientSide, masterTable]);

  // ── Server-side path (disabled when masterTable is provided) ──────────────
  const initialParams = useMemo(() => {
    if (!enabled || useClientSide) return undefined;
    return {
      datasetName,
      folder,
      ...(filterColumns && { filter_columns: filterColumns }),
    };
  }, [enabled, useClientSide, datasetName, folder, filterColumns]);

  const viewTransform = useViewTransform<{
    datasetName: string;
    folder: "inputs" | "outputs" | "settings";
    filterColumns?: string[];
  }>({
    transformId: "get_schema",
    runSettings,
    initialParams,
    organizationId,
    useDirectVT,
  });

  const serverProfiles = useMemo((): ColumnProfile[] => {
    if (useClientSide) return [];
    const arrowTable = viewTransform.arrowTable;
    const columns = viewTransform.columns;

    if (!arrowTable || arrowTable.numRows === 0) return [];

    const profiles: ColumnProfile[] = [];
    const getRow = (rowIndex: number): Record<string, unknown> => {
      const row: Record<string, unknown> = {};
      for (const colName of columns) {
        const col = arrowTable.getChild(colName);
        if (col) row[colName] = col.get(rowIndex);
      }
      return row;
    };

    const firstRow = getRow(0);
    const totalRowCount = firstRow.rowCount ? Number(firstRow.rowCount) : 0;

    for (let i = 0; i < arrowTable.numRows; i++) {
      const row = getRow(i);
      const profile: ColumnProfile = {
        name: String(row.name ?? ""),
        type: String(row.type ?? ""),
        nullCount: Number(row.nullCount ?? 0),
        rowCount: totalRowCount,
      };
      if (row.min !== null && row.min !== undefined) {
        const minNum = Number(row.min);
        profile.min = isNaN(minNum) ? String(row.min) : minNum;
      }
      if (row.max !== null && row.max !== undefined) {
        const maxNum = Number(row.max);
        profile.max = isNaN(maxNum) ? String(row.max) : maxNum;
      }
      if (row.uniqueValues !== null && row.uniqueValues !== undefined) {
        try {
          profile.uniqueValues = JSON.parse(String(row.uniqueValues));
        } catch {
          profile.uniqueValues = [];
        }
        profile.uniqueCount =
          row.uniqueCount !== null && row.uniqueCount !== undefined
            ? Number(row.uniqueCount)
            : (profile.uniqueValues?.length ?? 0);
      }
      if (row.crossFilterOptions !== null && row.crossFilterOptions !== undefined) {
        try {
          profile.crossFilterOptions = JSON.parse(String(row.crossFilterOptions));
        } catch {
          profile.crossFilterOptions = undefined;
        }
      }
      profiles.push(profile);
    }
    return profiles;
  }, [useClientSide, viewTransform.arrowTable, viewTransform.columns]);

  // ── Return ────────────────────────────────────────────────────────────────

  if (useClientSide) {
    return {
      columnProfiles: clientProfiles,
      loading: !masterTable || masterTable.numRows === 0,
      error: null,
      rowCount: masterTable?.numRows ?? 0,
      columns: clientColumns,
    };
  }

  return {
    columnProfiles: serverProfiles,
    loading: viewTransform.loading,
    error: viewTransform.error,
    rowCount: viewTransform.rowCount,
    columns: viewTransform.columns,
  };
}

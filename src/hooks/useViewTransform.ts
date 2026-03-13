import * as arrow from "apache-arrow";
import { useMemo } from "react";
import { buyerOpsStubData } from "../data/buyerops-stub";

/**
 * Stub implementation of useViewTransform.
 *
 * Instead of fetching Parquet from S3 via the ViewTransforms service,
 * this builds an Apache Arrow table directly from the JSON stub data in
 * src/data/buyerops-stub.ts.
 *
 * To change the data shown in the app, edit that file.
 */

// Module-level table so all hook instances share the same reference
// (matches original caching behaviour).
let cachedTable: arrow.Table | null = null;

function getStubTable(): arrow.Table {
  if (!cachedTable) {
    // tableFromJSON accepts an array of plain objects and infers the schema
    cachedTable = arrow.tableFromJSON(buyerOpsStubData);
  }
  return cachedTable;
}

/** No-op — there is no remote cache to clear in stub mode. */
export function clearCreatedViewTransformCache(
  _transformIds: string[],
  _runSettings: string
): void {
  // no-op
}

interface UseViewTransformOptions {
  transformId: string;
  runSettings?: string;
  initialParams?: unknown;
  organizationId?: string;
  useDirectVT?: boolean;
}

interface UseViewTransformReturn {
  arrowTable: arrow.Table | null;
  columns: string[];
  rowCount: number;
  loading: boolean;
  refreshing: boolean;
  error: Error | null;
  createViewTransform: (params: unknown) => Promise<void>;
}

export function useViewTransform<_T>(
  _options: UseViewTransformOptions
): UseViewTransformReturn {
  const arrowTable = useMemo(() => getStubTable(), []);
  const columns = useMemo(
    () => arrowTable.schema.fields.map((f) => f.name),
    [arrowTable]
  );

  return {
    arrowTable,
    columns,
    rowCount: arrowTable.numRows,
    loading: false,
    refreshing: false,
    error: null,
    createViewTransform: async () => {
      // no-op — data is always immediately available from stub
    },
  };
}

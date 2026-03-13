import * as arrow from "apache-arrow";

/**
 * Parameters for creating a view transform
 */
export interface ViewTransformParams {
  transformId: string;
  runSettings: string;
  transformationSettings: string;
}

/**
 * Parsed parquet data structure - now stores Arrow table instead of JS objects
 */
export interface ParsedParquetData {
  columns: string[];
  arrowTable: arrow.Table;
}

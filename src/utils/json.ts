/**
 * JSON normalization utilities
 *
 * Normalizes JSON strings to match backend's deterministic ID generation.
 * Backend uses JSON.stringify with sorted keys (sort_keys=True in Python),
 * so we need to match that behavior exactly.
 *
 * IMPORTANT: This also strips null values and empty arrays to ensure consistent
 * hashing. Without this, {sort:[...]} and {filters:[], sort:[...]} would generate
 * different hashes, causing view transform ID mismatches between frontend and backend.
 */

/**
 * Safely stringify an object that may contain BigInt values.
 * Converts BigInt to a string representation for comparison/serialization purposes.
 *
 * @param obj - The object to stringify (may contain BigInt values)
 * @returns JSON string with BigInt values converted to strings
 *
 * @example
 * ```ts
 * const obj = { id: 123n, name: "test" };
 * safeStringify(obj); // '{"id":"123","name":"test"}'
 * ```
 */
export function safeStringify(obj: unknown): string {
  return JSON.stringify(obj, (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });
}

/**
 * Check if a value is "empty" and should be stripped from params.
 * Empty values: null, undefined, empty arrays []
 *
 * @param value - The value to check
 * @returns true if the value should be stripped
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEmptyValue(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  return false;
}

/**
 * Normalize a JSON string by:
 * 1. Stripping null values and empty arrays (to ensure consistent hashing)
 * 2. Sorting all keys recursively (to match backend's sort_keys=True behavior)
 *
 * This ensures deterministic JSON output that matches the backend's normalization.
 *
 * @param jsonString - The JSON string to normalize
 * @returns Normalized JSON string with sorted keys and stripped empty values
 */
export function normalizeJson(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    // Sort keys recursively and strip empty values to match backend behavior
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalize = (obj: any): any => {
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      if (Array.isArray(obj)) {
        return obj.map(normalize);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizedObj: Record<string, any> = {};
      Object.keys(obj)
        .sort()
        .forEach((key) => {
          const value = obj[key];
          // Skip null values and empty arrays at the top level of params
          // This ensures {sort:[...]} and {filters:[], sort:[...]} hash the same
          if (!isEmptyValue(value)) {
            normalizedObj[key] = normalize(value);
          }
        });
      return normalizedObj;
    };
    return JSON.stringify(normalize(parsed));
  } catch {
    return jsonString;
  }
}

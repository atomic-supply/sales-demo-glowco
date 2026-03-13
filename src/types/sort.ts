/**
 * Shared sort types for view transforms
 * Reusable across all transforms that need sorting functionality
 */

export interface SortCriteria {
  column: string;
  direction: "asc" | "desc";
}

/**
 * Three-state sort toggle: desc -> asc -> remove
 * Returns the next sort state for a column
 */
export function getNextSortState(currentSort: SortCriteria[], column: string): SortCriteria[] {
  const existingIndex = currentSort.findIndex((s) => s.column === column);
  const existing = existingIndex >= 0 ? currentSort[existingIndex] : null;

  if (!existing) {
    // Not sorted: add as desc (first click)
    return [...currentSort, { column, direction: "desc" }];
  } else if (existing.direction === "desc") {
    // Currently desc: change to asc (second click)
    const newSort = [...currentSort];
    newSort[existingIndex] = { column, direction: "asc" };
    return newSort;
  } else {
    // Currently asc: remove from sort (third click)
    return currentSort.filter((_, index) => index !== existingIndex);
  }
}

/**
 * Get the current sort direction for a column
 */
export function getSortDirection(sort: SortCriteria[], column: string): "asc" | "desc" | null {
  const criteria = sort.find((s) => s.column === column);
  return criteria?.direction ?? null;
}

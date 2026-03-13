import type { Run } from "../../types/run";

export interface RunContextType {
  latestRun: Run | null;
  /** Latest successful run for workflow_atomic_pivots */
  latestSuccessfulRun: Run | null;
  runs: Run[];
  isLoading: boolean;
  error: Error | null;
}

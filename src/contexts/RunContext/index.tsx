/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo, type ReactNode } from "react";
import { Run, RunStatus } from "../../types/run";
import type { RunContextType } from "./types";

export const RunContext = createContext<RunContextType | undefined>(undefined);

const STUB_RUN: Run = {
  runSettings: JSON.stringify({
    input_id: "stub-input-001",
    organization_id: "atomic",
    workflow_id: "workflow_atomic_pivots",
    settings_name_and_version: "stub_settings_v1",
    run_attempt_id: "stub-attempt-001",
  }),
  organizationId: "atomic",
  status: RunStatus.RUN_COMPLETED,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  stepIds: "",
  initiatedBy: null,
  name: "Stub Run",
  description: "Stub data run",
};

export const RunProvider = ({ children }: { children: ReactNode }) => {
  const contextValue = useMemo<RunContextType>(
    () => ({
      latestRun: STUB_RUN,
      latestSuccessfulRun: STUB_RUN,
      runs: [STUB_RUN],
      isLoading: false,
      error: null,
    }),
    []
  );

  return <RunContext.Provider value={contextValue}>{children}</RunContext.Provider>;
};

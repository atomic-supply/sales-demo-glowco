export enum ViewTransformStatus {
  IN_PROGRESS = "IN_PROGRESS",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

export enum RunStatus {
  TO_RUN = "TO_RUN",
  RUN_COMPLETED = "RUN_COMPLETED",
  RUN_IN_PROGRESS = "RUN_IN_PROGRESS",
  RUN_FAILED = "RUN_FAILED",
  CANCEL_COMPLETED = "CANCEL_COMPLETED",
  CANCEL_IN_PROGRESS = "CANCEL_IN_PROGRESS",
  CANCEL_FAILED = "CANCEL_FAILED",
}

export interface Run {
  runSettings: string;
  organizationId: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  stepIds: string;
  initiatedBy?: string | null;
  name?: string | null;
  description?: string | null;
}

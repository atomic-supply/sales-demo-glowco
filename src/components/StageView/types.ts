export type ModuleId =
  | "consumption"
  | "shipments"
  | "production"
  | "kitting"
  | "mrp"
  | "allocation";

export interface PlanColumn {
  key: string;
  label: string;
  type: "label" | "number" | "wos" | "badge" | "pct";
  sticky?: boolean;
  width?: number;
  editable?: boolean;
}

export interface PlanRow {
  id: string;
  label: string;
  type: "parent" | "child";
  parentId?: string;
  values: Record<string, number | string | null>;
  attribution?: "engine" | "override" | "upstream";
}

export type ActionStatus = "needs-review" | "approved" | "in-progress" | "on-track";

export interface ActionRow {
  id: string;
  label: string;
  values: Record<string, number | string | null>;
  status: ActionStatus;
  /** IDs of detail rows belonging to this action */
  detailIds: string[];
}

export interface ActionTableConfig {
  title: string;
  description: string;
  columns: PlanColumn[];
  rows: ActionRow[];
}

export interface InboxAlert {
  id: string;
  severity: "warning" | "info" | "critical";
  message: string;
  affectedItem: string;
  module: string;
}

export interface WalkDataPoint {
  period: string;
  inventory: number;
  safetyStock: number;
  targetMin: number;
  targetMax: number;
}

export interface ModuleConfig {
  id: ModuleId;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  actionTable: ActionTableConfig;
  columns: PlanColumn[];
  rows: PlanRow[];
  alerts: InboxAlert[];
  walkData: Record<string, WalkDataPoint[]>;
}

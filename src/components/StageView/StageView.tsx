/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { theme } from "../../styles/theme/theme";
import { InboxBanner } from "./InboxBanner";
import { PlanTable } from "./PlanTable";
import { WalkChart } from "./WalkChart";
import type { ModuleId, ModuleConfig, PlanRow } from "./types";

/* ------------------------------------------------------------------ */
/*  Module metadata (pills / labels) -- minimal defaults                */
/* ------------------------------------------------------------------ */

const MODULE_META: Record<
  ModuleId,
  { label: string; shortLabel: string; color: string; description: string }
> = {
  consumption: {
    label: "Consumption",
    shortLabel: "Consumption",
    color: "#2563EB",
    description: "Retail consumption forecast and demand sensing",
  },
  shipments: {
    label: "Shipments",
    shortLabel: "Shipments",
    color: "#0891B2",
    description: "Customer shipment forecast and order planning",
  },
  production: {
    label: "Production",
    shortLabel: "Production",
    color: "#7C3AED",
    description: "Production plan and line scheduling",
  },
  kitting: {
    label: "Kitting",
    shortLabel: "Kitting",
    color: "#DB2777",
    description: "Kit and bundle assembly planning",
  },
  mrp: {
    label: "MRP",
    shortLabel: "MRP",
    color: "#EA580C",
    description: "Material requirements planning and procurement",
  },
  allocation: {
    label: "Allocation",
    shortLabel: "Allocation",
    color: "#16A34A",
    description: "Inventory allocation and deployment",
  },
};

const MODULE_ORDER: ModuleId[] = [
  "consumption",
  "shipments",
  "production",
  "kitting",
  "mrp",
  "allocation",
];

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

interface StageViewProps {
  moduleId: ModuleId;
  config?: ModuleConfig;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const rootStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0;
  font-family: ${theme.typography.fontFamily};
  height: 100%;
`;

/* Module selector bar */
const selectorBarStyles = css`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0 12px;
  overflow-x: auto;
  flex-shrink: 0;
`;

const pillStyles = (color: string, isActive: boolean) => css`
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  font-family: ${theme.typography.fontFamily};
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid ${isActive ? color : theme.colors.gray200};
  background: ${isActive ? color : theme.colors.white};
  color: ${isActive ? theme.colors.white : theme.colors.gray600};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${color};
    ${!isActive ? `color: ${color};` : ""}
  }
`;

/* Module header */
const headerStyles = css`
  margin-bottom: ${theme.spacing.md};
  flex-shrink: 0;
`;

const moduleNameStyles = css`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray900};
  margin: 0 0 2px;
`;

const moduleDescStyles = css`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray500};
  margin: 0;
`;

/* Content area */
const contentStyles = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function StageView({ moduleId, config }: StageViewProps) {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<PlanRow | null>(null);

  const meta = MODULE_META[moduleId];

  const handleModuleClick = useCallback(
    (id: ModuleId) => {
      navigate(`/plan/${id}`);
    },
    [navigate]
  );

  const handleRowSelect = useCallback(
    (row: PlanRow) => {
      setSelectedRow((prev) => (prev?.id === row.id ? null : row));
    },
    []
  );

  /* Walk chart data for selected row */
  const walkData = useMemo(() => {
    if (!selectedRow || !config?.walkData) return [];
    return config.walkData[selectedRow.id] ?? [];
  }, [selectedRow, config]);

  /* Columns / rows / alerts from config or empty */
  const columns = config?.columns ?? [];
  const rows = config?.rows ?? [];
  const alerts = config?.alerts ?? [];

  return (
    <div css={rootStyles}>
      {/* Module selector pills */}
      <div css={selectorBarStyles}>
        {MODULE_ORDER.map((id) => {
          const m = MODULE_META[id];
          return (
            <button
              key={id}
              css={pillStyles(m.color, id === moduleId)}
              onClick={() => handleModuleClick(id)}
            >
              {m.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Module title */}
      <div css={headerStyles}>
        <h2 css={moduleNameStyles}>{meta.label}</h2>
        <p css={moduleDescStyles}>{meta.description}</p>
      </div>

      {/* Content: inbox + table + chart */}
      <div css={contentStyles}>
        {/* Inbox banner */}
        <InboxBanner alerts={alerts} />

        {/* Plan table */}
        {columns.length > 0 && rows.length > 0 ? (
          <PlanTable
            columns={columns}
            rows={rows}
            selectedRowId={selectedRow?.id ?? null}
            onRowSelect={handleRowSelect}
          />
        ) : (
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 48px 24px;
              color: ${theme.colors.gray400};
              font-size: ${theme.typography.fontSize.sm};
              border: 1px dashed ${theme.colors.gray200};
              border-radius: ${theme.borderRadius.lg};
            `}
          >
            No plan data configured for this module.
          </div>
        )}

        {/* Walk chart -- shown when a row is selected */}
        {selectedRow && walkData.length > 0 && (
          <WalkChart data={walkData} title={selectedRow.label} />
        )}
      </div>
    </div>
  );
}

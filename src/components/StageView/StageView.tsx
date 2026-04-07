/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useMemo } from "react";
import { theme } from "../../styles/theme/theme";
import { InboxBanner } from "./InboxBanner";
import { ActionTable } from "./ActionTable";
import { DetailTable } from "./DetailTable";
import { StageViewFilterBar } from "./StageViewFilterBar";
import type { ModuleId, ModuleConfig } from "./types";

/* ------------------------------------------------------------------ */
/*  Module metadata (pills / labels)                                    */
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

/* ------------------------------------------------------------------ */
/*  Default segment values per module                                   */
/* ------------------------------------------------------------------ */

const DEFAULT_SEGMENTS: Record<ModuleId, string> = {
  consumption: "channel",
  shipments: "sku",
  production: "formulation",
  kitting: "packConfig",
  mrp: "material",
  allocation: "sku",
} as Record<ModuleId, string>;

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

const headerStyles = css`
  margin-bottom: ${theme.spacing.sm};
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

const contentStyles = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: ${theme.spacing.md};
  overflow-y: auto;
`;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function StageView({ moduleId, config }: StageViewProps) {
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

  /* Filter bar state */
  const [displayBy, setDisplayBy] = useState<"week" | "month">("week");
  const [segmentBy, setSegmentBy] = useState<string>(DEFAULT_SEGMENTS[moduleId] ?? "sku");
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>("sticks");
  const [searchText, setSearchText] = useState<string>("");

  const meta = MODULE_META[moduleId];

  const alerts = config?.alerts ?? [];
  const walkData = useMemo(() => config?.walkData ?? {}, [config]);

  return (
    <div css={rootStyles}>
      {/* Module title */}
      <div css={headerStyles}>
        <h2 css={moduleNameStyles}>{meta.label}</h2>
        <p css={moduleDescStyles}>{meta.description}</p>
      </div>

      {/* Filter bar */}
      <StageViewFilterBar
        moduleId={moduleId}
        displayBy={displayBy}
        onDisplayByChange={setDisplayBy}
        segmentBy={segmentBy}
        onSegmentByChange={setSegmentBy}
        unitOfMeasure={unitOfMeasure}
        onUnitOfMeasureChange={setUnitOfMeasure}
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      {/* Content: inbox + action table + detail table */}
      <div css={contentStyles}>
        <InboxBanner alerts={alerts} />

        {config?.actionTable && (
          <ActionTable
            config={config.actionTable}
            selectedActionId={selectedActionId}
            onActionSelect={setSelectedActionId}
          />
        )}

        {config && config.columns.length > 0 && config.rows.length > 0 ? (
          <DetailTable
            columns={config.columns}
            rows={config.rows}
            moduleId={moduleId}
            moduleLabel={meta.label}
            selectedActionId={selectedActionId}
            actionRows={config.actionTable?.rows ?? []}
            supplyWalkData={walkData}
            searchText={searchText}
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
      </div>
    </div>
  );
}

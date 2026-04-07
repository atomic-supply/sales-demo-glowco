/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMemo, useCallback } from "react";
import { theme } from "../../styles/theme/theme";
import { Card } from "../ui/card";
import { TableCardHeader } from "../ui/table-card-header";
import { Badge } from "../ui/badge";
import { tableStyles as ts } from "../../styles/mixins/table";
import { TableHead } from "../ui/table";
import type { ActionTableConfig, ActionRow, PlanColumn, ActionStatus } from "./types";

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

export interface ActionTableProps {
  config: ActionTableConfig;
  selectedActionId: string | null;
  onActionSelect: (id: string | null) => void;
}

/* ------------------------------------------------------------------ */
/*  Formatting                                                          */
/* ------------------------------------------------------------------ */

const numberFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const pctFmt = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });

function formatValue(value: number | string | null, colType: PlanColumn["type"]): string {
  if (value == null || value === "") return "--";
  if (typeof value === "string") return value;
  if (colType === "pct") return pctFmt.format(value);
  return numberFmt.format(value);
}

/* ------------------------------------------------------------------ */
/*  Status config                                                       */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<ActionStatus, { label: string; bg: string; fg: string }> = {
  "needs-review": { label: "Needs Review", bg: "#FEF3C7", fg: "#92400E" },
  approved: { label: "Approved", bg: "#D1FAE5", fg: "#065F46" },
  "in-progress": { label: "In Progress", bg: "#DBEAFE", fg: "#1D4ED8" },
  "on-track": { label: "On Track", bg: "#F0FDF4", fg: "#166534" },
};

/* ------------------------------------------------------------------ */
/*  WOS helpers                                                         */
/* ------------------------------------------------------------------ */

function wosColor(value: number | string | null): string {
  if (value == null || typeof value === "string") return "inherit";
  if (value < 4) return "#EF4444";
  if (value < 8) return "#F59E0B";
  if (value <= 15) return "#22C55E";
  return "#3B82F6";
}

function wosBg(value: number | string | null): string {
  if (value == null || typeof value === "string") return "transparent";
  if (value < 4) return "#FEF2F2";
  if (value < 8) return "#FFFBEB";
  if (value <= 15) return "#F0FDF4";
  return "#EFF6FF";
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const cardOverride = css`
  padding: 0;
  overflow: hidden;
  flex-shrink: 0;
`;

const tableWrap = css`
  overflow-x: auto;
`;

const table = css`
  width: 100%;
  border-collapse: collapse;
  font-family: ${theme.typography.fontFamily};
`;

const thCell = css`
  padding: 0.5rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray500};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  background: ${theme.colors.muted};
  border-bottom: 1px solid ${theme.colors.gray200};
  text-align: right;
`;

const thLabel = css`
  ${thCell}
  text-align: left;
  position: sticky;
  left: 0;
  z-index: 2;
`;

const tdCell = css`
  padding: 0.625rem 0.75rem;
  white-space: nowrap;
  font-size: 0.8125rem;
  color: ${theme.colors.gray800};
  border-bottom: 1px solid ${theme.colors.gray100};
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const tdLabel = css`
  ${tdCell}
  text-align: left;
  font-weight: ${theme.typography.fontWeight.medium};
  position: sticky;
  left: 0;
  z-index: 1;
  background: inherit;
`;

const rowBase = css`
  cursor: pointer;
  transition: background 0.1s;
`;

const rowSelected = css`
  background: ${theme.colors.blue50};
`;

const rowDefault = css`
  background: ${theme.colors.white};
  &:hover {
    background: ${theme.colors.gray50};
  }
`;

const statusBadge = (bg: string, fg: string) => css`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: ${theme.typography.fontWeight.medium};
  background: ${bg};
  color: ${fg};
  white-space: nowrap;
`;

const wosBadge = (value: number | string | null) => css`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: 12px;
  color: ${wosColor(value)};
  background: ${wosBg(value)};
  min-width: 36px;
  text-align: center;
`;

const footerBar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: ${theme.colors.gray50};
  border-top: 1px solid ${theme.colors.gray200};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray500};
`;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function ActionTable({ config, selectedActionId, onActionSelect }: ActionTableProps) {
  const { title, description, columns, rows } = config;

  const handleRowClick = useCallback(
    (row: ActionRow) => {
      onActionSelect(selectedActionId === row.id ? null : row.id);
    },
    [selectedActionId, onActionSelect],
  );

  return (
    <Card css={cardOverride}>
      <TableCardHeader
        title={title}
        description={description}
        actions={
          <Badge variant="secondary" css={css`font-size: 11px;`}>
            {rows.length} {rows.length === 1 ? "item" : "items"}
          </Badge>
        }
      />

      <div css={tableWrap}>
        <table css={table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  css={col.type === "label" ? thLabel : thCell}
                  style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelected = row.id === selectedActionId;
              const sCfg = STATUS_CONFIG[row.status];

              return (
                <tr
                  key={row.id}
                  css={[rowBase, isSelected ? rowSelected : rowDefault]}
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((col) => {
                    if (col.type === "label") {
                      return (
                        <td key={col.key} css={tdLabel}>
                          {row.label}
                        </td>
                      );
                    }

                    if (col.key === "status") {
                      return (
                        <td key={col.key} css={tdCell}>
                          <span css={statusBadge(sCfg.bg, sCfg.fg)}>{sCfg.label}</span>
                        </td>
                      );
                    }

                    if (col.key === "trend") {
                      const val = row.values[col.key];
                      return (
                        <td key={col.key} css={tdCell}>
                          <span css={css`font-size: 14px;`}>{val ?? "--"}</span>
                        </td>
                      );
                    }

                    if (col.type === "wos") {
                      const val = row.values[col.key];
                      return (
                        <td key={col.key} css={tdCell}>
                          <span css={wosBadge(val as number)}>{formatValue(val, col.type)}</span>
                        </td>
                      );
                    }

                    const val = row.values[col.key];
                    return (
                      <td key={col.key} css={tdCell}>
                        {formatValue(val, col.type)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div css={footerBar}>
        <span>{rows.length} action {rows.length === 1 ? "item" : "items"}</span>
        {selectedActionId && (
          <span css={css`color: ${theme.colors.blue600}; font-weight: ${theme.typography.fontWeight.medium};`}>
            Filtering detail table below
          </span>
        )}
      </div>
    </Card>
  );
}

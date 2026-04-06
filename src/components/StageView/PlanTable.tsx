/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { theme } from "../../styles/theme/theme";
import type { PlanColumn, PlanRow } from "./types";

interface PlanTableProps {
  columns: PlanColumn[];
  rows: PlanRow[];
  selectedRowId?: string | null;
  onRowSelect?: (row: PlanRow) => void;
}

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

const numberFmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const pctFmt = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

function formatCellValue(
  value: number | string | null,
  colType: PlanColumn["type"]
): string {
  if (value == null || value === "") return "--";
  if (typeof value === "string") return value;
  if (colType === "pct") return pctFmt.format(value);
  return numberFmt.format(value);
}

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
/*  Attribution badge                                                   */
/* ------------------------------------------------------------------ */

const attributionConfig: Record<
  string,
  { label: string; bg: string; fg: string }
> = {
  engine: { label: "Engine", bg: "#DBEAFE", fg: "#1D4ED8" },
  override: { label: "Override", bg: "#FEF3C7", fg: "#92400E" },
  upstream: { label: "Upstream", bg: "#EDE9FE", fg: "#6D28D9" },
};

const badgeStyles = (bg: string, fg: string) => css`
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: ${theme.typography.fontWeight.medium};
  background: ${bg};
  color: ${fg};
  white-space: nowrap;
`;

/* ------------------------------------------------------------------ */
/*  Table styles                                                        */
/* ------------------------------------------------------------------ */

const wrapperStyles = css`
  overflow-x: auto;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.white};
`;

const tableStyles = css`
  width: 100%;
  min-width: 800px;
  border-collapse: separate;
  border-spacing: 0;
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.sm};
`;

const theadStyles = css`
  position: sticky;
  top: 0;
  z-index: 2;
`;

const thStyles = (col: PlanColumn) => css`
  padding: 8px 12px;
  text-align: ${col.type === "label" ? "left" : "right"};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray500};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${theme.colors.gray50};
  border-bottom: 1px solid ${theme.colors.gray200};
  white-space: nowrap;
  ${col.sticky
    ? `
    position: sticky;
    left: 0;
    z-index: 3;
    background: ${theme.colors.gray50};
  `
    : ""}
  ${col.width ? `width: ${col.width}px; min-width: ${col.width}px;` : ""}
`;

const trStyles = (
  isParent: boolean,
  isSelected: boolean,
  isVisible: boolean
) => css`
  display: ${isVisible ? "table-row" : "none"};
  cursor: pointer;
  transition: background 0.1s ease;
  ${isSelected
    ? `
    background: ${theme.colors.blue50};
    box-shadow: inset 3px 0 0 0 ${theme.colors.blue600};
  `
    : ""}

  &:hover {
    background: ${isSelected ? theme.colors.blue50 : theme.colors.gray50};
  }

  ${isParent
    ? `
    font-weight: ${theme.typography.fontWeight.medium};
  `
    : ""}
`;

const tdStyles = (col: PlanColumn, isChild: boolean) => css`
  padding: 8px 12px;
  border-bottom: 1px solid ${theme.colors.gray100};
  text-align: ${col.type === "label" ? "left" : "right"};
  white-space: nowrap;
  color: ${theme.colors.gray800};
  ${col.sticky
    ? `
    position: sticky;
    left: 0;
    z-index: 1;
    background: inherit;
  `
    : ""}
  ${col.type === "label" && isChild ? `padding-left: 36px;` : ""}
`;

const wosCellStyles = (value: number | string | null) => css`
  color: ${wosColor(value)};
  background: ${wosBg(value)};
  font-weight: ${theme.typography.fontWeight.semibold};
  border-radius: 3px;
  padding: 2px 8px;
  display: inline-block;
  min-width: 36px;
  text-align: center;
`;

const chevronWrapStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${theme.colors.gray400};
`;

const labelCellStyles = css`
  display: flex;
  align-items: center;
  gap: 6px;
`;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function PlanTable({
  columns,
  rows,
  selectedRowId,
  onRowSelect,
}: PlanTableProps) {
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    () => new Set(rows.filter((r) => r.type === "parent").map((r) => r.id))
  );

  const toggleExpand = useCallback((parentId: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  }, []);

  const handleRowClick = useCallback(
    (row: PlanRow) => {
      if (row.type === "parent") {
        toggleExpand(row.id);
      }
      onRowSelect?.(row);
    },
    [toggleExpand, onRowSelect]
  );

  const isRowVisible = (row: PlanRow): boolean => {
    if (row.type === "parent") return true;
    return row.parentId ? expandedParents.has(row.parentId) : true;
  };

  return (
    <div css={wrapperStyles}>
      <table css={tableStyles}>
        <thead css={theadStyles}>
          <tr>
            {columns.map((col) => (
              <th key={col.key} css={thStyles(col)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isParent = row.type === "parent";
            const isSelected = selectedRowId === row.id;
            const visible = isRowVisible(row);
            const isExpanded = isParent && expandedParents.has(row.id);

            return (
              <tr
                key={row.id}
                css={trStyles(isParent, isSelected, visible)}
                onClick={() => handleRowClick(row)}
              >
                {columns.map((col) => {
                  const raw = row.values[col.key];

                  /* Label column with expand chevron */
                  if (col.type === "label") {
                    return (
                      <td key={col.key} css={tdStyles(col, !isParent)}>
                        <div css={labelCellStyles}>
                          {isParent && (
                            <span css={chevronWrapStyles}>
                              {isExpanded ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </span>
                          )}
                          {row.label}
                        </div>
                      </td>
                    );
                  }

                  /* WOS colored cell */
                  if (col.type === "wos") {
                    return (
                      <td key={col.key} css={tdStyles(col, !isParent)}>
                        <span css={wosCellStyles(raw)}>
                          {formatCellValue(raw, col.type)}
                        </span>
                      </td>
                    );
                  }

                  /* Attribution badge */
                  if (col.type === "badge") {
                    const attrKey = (raw as string) || row.attribution;
                    const cfg = attrKey
                      ? attributionConfig[attrKey]
                      : undefined;
                    return (
                      <td key={col.key} css={tdStyles(col, !isParent)}>
                        {cfg ? (
                          <span css={badgeStyles(cfg.bg, cfg.fg)}>
                            {cfg.label}
                          </span>
                        ) : (
                          "--"
                        )}
                      </td>
                    );
                  }

                  /* Number / pct */
                  return (
                    <td key={col.key} css={tdStyles(col, !isParent)}>
                      {formatCellValue(raw, col.type)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

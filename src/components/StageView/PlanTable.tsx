/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Download,
  RefreshCw,
} from "lucide-react";
import { theme } from "../../styles/theme/theme";
import { Card, CardContent } from "../ui/card";
import { TableCardHeader } from "../ui/table-card-header";
import { Badge } from "../ui/badge";
import { DataTable } from "../DataTable";
import { TableHead } from "../ui/table";
import { tableStyles as ts } from "../../styles/mixins/table";
import { SupplyWalkInline } from "./SupplyWalkInline";
import type { PlanColumn, PlanRow, WalkDataPoint } from "./types";

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

export interface PlanTableProps {
  columns: PlanColumn[];
  rows: PlanRow[];
  moduleId: string;
  moduleLabel: string;
  selectedRowId?: string | null;
  onRowSelect?: (row: PlanRow) => void;
  supplyWalkData?: Record<string, WalkDataPoint[]>;
  searchText?: string;
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

/* ------------------------------------------------------------------ */
/*  WOS colors                                                          */
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
/*  Attribution config                                                  */
/* ------------------------------------------------------------------ */

const attributionConfig: Record<
  string,
  { label: string; bg: string; fg: string }
> = {
  engine: { label: "Engine", bg: "#DBEAFE", fg: "#1D4ED8" },
  override: { label: "Override", bg: "#FEF3C7", fg: "#92400E" },
  upstream: { label: "Upstream", bg: "#EDE9FE", fg: "#6D28D9" },
};

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const cardOverride = css`
  padding: 0;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const tableWrap = css`
  flex: 1;
  overflow: hidden;
  min-height: 0;
`;

const cellBase = css`
  padding: 0.5rem 0.75rem;
  white-space: nowrap;
  font-size: 0.8125rem;
  color: ${theme.colors.gray800};
  border-bottom: 1px solid ${theme.colors.gray100};
`;

const cellRight = css`
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const cellLabel = css`
  text-align: left;
`;

const cellIndent = css`
  padding-left: 36px;
`;

const stickyLeft = css`
  position: sticky;
  left: 0;
  z-index: 1;
  background: inherit;
`;

const stickyLeftHead = css`
  position: sticky;
  left: 0;
  z-index: 2;
  background: ${theme.colors.muted};
`;

const labelFlex = css`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const chevronWrap = css`
  display: inline-flex;
  align-items: center;
  color: ${theme.colors.gray400};
  flex-shrink: 0;
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

const attrBadge = (bg: string, fg: string) => css`
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

const editableIndicator = css`
  position: relative;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-top: 6px solid ${theme.colors.orange500};
  }
`;

const editInput = css`
  width: 80px;
  padding: 2px 6px;
  border: 1px solid ${theme.colors.blue500};
  border-radius: 3px;
  font-size: 0.8125rem;
  font-family: ${theme.typography.fontFamily};
  text-align: right;
  outline: none;
  font-variant-numeric: tabular-nums;
  background: ${theme.colors.white};

  &:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const footerBar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${theme.colors.gray50};
  border-top: 1px solid ${theme.colors.gray200};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray500};
  flex-shrink: 0;
`;

const editBar = css`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #FFFBEB;
  border-top: 2px solid ${theme.colors.orange500};
  flex-shrink: 0;
`;

const editBarText = css`
  flex: 1;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray800};
`;

const editBarBtn = (variant: "primary" | "secondary") => css`
  padding: 5px 14px;
  border-radius: 6px;
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-family: ${theme.typography.fontFamily};
  cursor: pointer;
  border: 1px solid ${variant === "primary" ? theme.colors.blue600 : theme.colors.gray300};
  background: ${variant === "primary" ? theme.colors.blue600 : theme.colors.white};
  color: ${variant === "primary" ? theme.colors.white : theme.colors.gray700};
  transition: background 0.15s;

  &:hover {
    background: ${variant === "primary" ? theme.colors.blue700 : theme.colors.gray50};
  }
`;

const actionBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.white};
  color: ${theme.colors.gray500};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${theme.colors.gray50};
    color: ${theme.colors.gray700};
    border-color: ${theme.colors.gray300};
  }
`;

/* ------------------------------------------------------------------ */
/*  Edit state type                                                     */
/* ------------------------------------------------------------------ */

type EditMap = Map<string, Map<string, number>>; // rowId -> colKey -> value

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function PlanTable({
  columns,
  rows,
  moduleId,
  moduleLabel,
  selectedRowId,
  onRowSelect,
  supplyWalkData,
  searchText,
}: PlanTableProps) {
  /* --- edits --- */
  const [edits, setEdits] = useState<EditMap>(new Map());
  const [editingCell, setEditingCell] = useState<{ rowId: string; colKey: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasEdits = edits.size > 0;
  const editCount = useMemo(() => {
    let count = 0;
    edits.forEach((colMap) => { count += colMap.size; });
    return count;
  }, [edits]);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const startEdit = useCallback((rowId: string, colKey: string) => {
    setEditingCell({ rowId, colKey });
  }, []);

  const commitEdit = useCallback((rowId: string, colKey: string, raw: string) => {
    const num = parseFloat(raw.replace(/,/g, ""));
    if (!isNaN(num)) {
      setEdits((prev) => {
        const next = new Map(prev);
        const colMap = new Map(next.get(rowId) ?? []);
        colMap.set(colKey, num);
        next.set(rowId, colMap);
        return next;
      });
    }
    setEditingCell(null);
  }, []);

  const clearEdits = useCallback(() => {
    setEdits(new Map());
    setEditingCell(null);
  }, []);

  /* --- filter rows by search --- */
  const filteredRows = useMemo(() => {
    if (!searchText) return rows;
    const q = searchText.toLowerCase();
    const matchingParentIds = new Set<string>();
    const matchingChildParentIds = new Set<string>();

    // First pass: find matching rows
    for (const row of rows) {
      if (row.label.toLowerCase().includes(q)) {
        if (row.type === "parent") {
          matchingParentIds.add(row.id);
        } else if (row.parentId) {
          matchingChildParentIds.add(row.parentId);
        }
      }
    }

    return rows.filter((row) => {
      if (row.label.toLowerCase().includes(q)) return true;
      // Show children of matching parents
      if (row.type === "child" && row.parentId && matchingParentIds.has(row.parentId)) return true;
      // Show parents whose children match
      if (row.type === "parent" && matchingChildParentIds.has(row.id)) return true;
      return false;
    });
  }, [rows, searchText]);

  /* --- row count --- */
  const parentCount = filteredRows.filter((r) => r.type === "parent").length;
  const totalCount = filteredRows.length;

  /* --- get cell value (with edit overlay) --- */
  const getCellValue = useCallback(
    (rowId: string, colKey: string, original: number | string | null): number | string | null => {
      const colEdits = edits.get(rowId);
      if (colEdits?.has(colKey)) return colEdits.get(colKey)!;
      return original;
    },
    [edits]
  );

  const isEdited = useCallback(
    (rowId: string, colKey: string): boolean => {
      return edits.get(rowId)?.has(colKey) ?? false;
    },
    [edits]
  );

  /* --- header actions --- */
  const headerActions = (
    <div css={css`display: flex; gap: 6px;`}>
      <button css={actionBtn} title="Export" type="button">
        <Download size={14} />
      </button>
      <button css={actionBtn} title="Refresh" type="button">
        <RefreshCw size={14} />
      </button>
    </div>
  );

  /* --- DataTable columns --- */
  const dtColumns = useMemo(
    () =>
      columns.map((col) => ({
        key: col.key,
        header: col.label,
        css: [
          ts.th,
          col.type !== "label" ? ts.right : undefined,
          col.sticky ? stickyLeftHead : undefined,
          col.width
            ? css`width: ${col.width}px; min-width: ${col.width}px;`
            : ts.colMin,
        ].filter(Boolean) as import("@emotion/react").Interpolation<import("../../styles").Theme>[],
      })),
    [columns]
  );

  /* --- renderCells --- */
  const renderCells = useCallback(
    (row: PlanRow, isExpanded: boolean, toggle: () => void) => {
      const isParent = row.type === "parent";

      return (
        <>
          {columns.map((col) => {
            const raw = getCellValue(row.id, col.key, row.values[col.key]);
            const edited = isEdited(row.id, col.key);
            const isEditingThis =
              editingCell?.rowId === row.id && editingCell?.colKey === col.key;

            /* Label column */
            if (col.type === "label") {
              return (
                <td
                  key={col.key}
                  css={[cellBase, cellLabel, col.sticky && stickyLeft, !isParent && cellIndent]}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isParent) toggle();
                    onRowSelect?.(row);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div css={labelFlex}>
                    {isParent && (
                      <span css={chevronWrap}>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                    )}
                    <span
                      css={css`font-weight: ${isParent ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal};`}
                    >
                      {row.label}
                    </span>
                  </div>
                </td>
              );
            }

            /* Inline edit mode */
            if (isEditingThis) {
              return (
                <td key={col.key} css={[cellBase, cellRight]}>
                  <input
                    ref={inputRef}
                    css={editInput}
                    defaultValue={raw != null ? String(raw) : ""}
                    onBlur={(e) => commitEdit(row.id, col.key, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        commitEdit(row.id, col.key, (e.target as HTMLInputElement).value);
                      }
                      if (e.key === "Escape") setEditingCell(null);
                    }}
                  />
                </td>
              );
            }

            /* WOS column */
            if (col.type === "wos") {
              return (
                <td key={col.key} css={[cellBase, cellRight]}>
                  <span css={wosBadge(raw)}>{formatCellValue(raw, col.type)}</span>
                </td>
              );
            }

            /* Badge column */
            if (col.type === "badge") {
              const attrKey = (raw as string) || row.attribution;
              const cfg = attrKey ? attributionConfig[attrKey] : undefined;
              return (
                <td key={col.key} css={[cellBase, cellRight]}>
                  {cfg ? (
                    <span css={attrBadge(cfg.bg, cfg.fg)}>{cfg.label}</span>
                  ) : (
                    <span css={css`color: ${theme.colors.gray400};`}>--</span>
                  )}
                </td>
              );
            }

            /* Number / pct */
            const isEditableCol = col.editable === true;
            return (
              <td
                key={col.key}
                css={[
                  cellBase,
                  cellRight,
                  isEditableCol && editableIndicator,
                  edited && css`background: ${theme.colors.orange50};`,
                ]}
                onClick={
                  isEditableCol
                    ? (e) => { e.stopPropagation(); startEdit(row.id, col.key); }
                    : undefined
                }
              >
                {formatCellValue(raw, col.type)}
              </td>
            );
          })}
        </>
      );
    },
    [columns, getCellValue, isEdited, editingCell, onRowSelect, startEdit, commitEdit]
  );

  /* --- renderExpandedContent --- */
  const renderExpandedContent = useCallback(
    (row: PlanRow) => {
      const walkData = supplyWalkData?.[row.id] ?? [];
      if (walkData.length === 0) {
        return (
          <td
            colSpan={columns.length}
            css={css`padding: 12px 40px; color: ${theme.colors.gray400}; font-size: 12px; background: ${theme.colors.gray50};`}
          >
            No supply walk data for this item.
          </td>
        );
      }
      return <SupplyWalkInline rowId={row.id} moduleId={moduleId} data={walkData} />;
    },
    [supplyWalkData, moduleId, columns.length]
  );

  /* --- getRowId --- */
  const getRowId = useCallback((row: PlanRow) => row.id, []);

  /* --- row selection highlight --- */
  const isRowSelected = useCallback(
    (row: PlanRow) => row.id === selectedRowId,
    [selectedRowId]
  );

  /* --- row background --- */
  const getRowBg = useCallback(
    (row: PlanRow, _isExpanded: boolean) => {
      if (row.type === "parent") return theme.colors.white;
      return theme.colors.white;
    },
    []
  );

  return (
    <Card css={cardOverride}>
      {/* Header */}
      <TableCardHeader
        title={moduleLabel}
        description={`${parentCount} groups, ${totalCount} rows`}
        actions={headerActions}
      />

      {/* Table */}
      <div css={tableWrap}>
        <DataTable<PlanRow>
          data={filteredRows}
          columns={dtColumns}
          renderCells={renderCells}
          getRowId={getRowId}
          renderExpandedContent={renderExpandedContent}
          isRowSelected={isRowSelected}
          getRowBg={getRowBg}
          getDetailRowBg={() => theme.colors.gray50}
        />
      </div>

      {/* Footer */}
      {!hasEdits && (
        <div css={footerBar}>
          <span>
            Showing {totalCount} rows
            {searchText ? ` (filtered)` : ""}
          </span>
          <Badge variant="secondary" css={css`font-size: 11px;`}>
            {parentCount} items
          </Badge>
        </div>
      )}

      {/* Edit save bar */}
      {hasEdits && (
        <div css={editBar}>
          <span css={editBarText}>
            {editCount} unsaved {editCount === 1 ? "change" : "changes"}
          </span>
          <button css={editBarBtn("secondary")} onClick={clearEdits} type="button">
            Discard
          </button>
          <button
            css={editBarBtn("primary")}
            onClick={() => {
              /* stub: save edits */
              clearEdits();
            }}
            type="button"
          >
            Save Changes
          </button>
        </div>
      )}
    </Card>
  );
}

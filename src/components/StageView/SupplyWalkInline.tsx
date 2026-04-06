/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMemo } from "react";
import { theme } from "../../styles/theme/theme";
import type { WalkDataPoint } from "./types";

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

export interface SupplyWalkInlineProps {
  rowId: string;
  moduleId: string;
  data: WalkDataPoint[];
}

/* ------------------------------------------------------------------ */
/*  Formatting                                                          */
/* ------------------------------------------------------------------ */

const numFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function fmt(value: number, prefix?: "+" | "-"): string {
  const formatted = numFmt.format(Math.abs(value));
  if (prefix === "+") return `+${formatted}`;
  if (prefix === "-") return `-${formatted}`;
  return numFmt.format(value);
}

/* ------------------------------------------------------------------ */
/*  Measure config                                                      */
/* ------------------------------------------------------------------ */

interface MeasureRow {
  key: string;
  label: string;
  color: string;
  bg: string;
  prefix?: "+" | "-";
  bold?: boolean;
  getValue: (dp: WalkDataPoint, prev?: WalkDataPoint) => number;
}

const MEASURES: MeasureRow[] = [
  {
    key: "startingInventory",
    label: "Starting Inventory",
    color: theme.colors.gray700,
    bg: "transparent",
    bold: true,
    getValue: (_dp, prev) => prev?.inventory ?? _dp.inventory,
  },
  {
    key: "inbound",
    label: "+ Inbound (Production/Kitting)",
    color: "#15803D",
    bg: "#F0FDF4",
    prefix: "+",
    getValue: (dp, prev) => {
      const start = prev?.inventory ?? dp.inventory;
      const ss = dp.safetyStock;
      // Simulate inbound as a fraction of safety stock
      return Math.round(ss * 0.6 + (dp.inventory - start) * 0.8);
    },
  },
  {
    key: "outbound",
    label: "- Outbound (Demand/Kitting)",
    color: "#DC2626",
    bg: "#FEF2F2",
    prefix: "-",
    getValue: (dp, prev) => {
      const start = prev?.inventory ?? dp.inventory;
      const inbound = Math.round(dp.safetyStock * 0.6 + (dp.inventory - start) * 0.8);
      return Math.abs(start + inbound - dp.inventory);
    },
  },
  {
    key: "endingInventory",
    label: "= Ending Inventory",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    bold: true,
    getValue: (dp) => dp.inventory,
  },
  {
    key: "safetyStock",
    label: "Safety Stock",
    color: "#EA580C",
    bg: "#FFF7ED",
    getValue: (dp) => dp.safetyStock,
  },
  {
    key: "targetMin",
    label: "Target Min",
    color: theme.colors.gray600,
    bg: "transparent",
    getValue: (dp) => dp.targetMin,
  },
  {
    key: "targetMax",
    label: "Target Max",
    color: theme.colors.gray600,
    bg: "transparent",
    getValue: (dp) => dp.targetMax,
  },
  {
    key: "wos",
    label: "WOS",
    color: theme.colors.gray700,
    bg: "transparent",
    bold: true,
    getValue: (dp) => {
      const weeklyDemand = dp.safetyStock * 0.25;
      return weeklyDemand > 0 ? Math.round((dp.inventory / weeklyDemand) * 10) / 10 : 0;
    },
  },
];

/* ------------------------------------------------------------------ */
/*  WOS color helpers                                                   */
/* ------------------------------------------------------------------ */

function wosColor(value: number): string {
  if (value < 4) return "#EF4444";
  if (value < 8) return "#F59E0B";
  if (value <= 15) return "#22C55E";
  return "#3B82F6";
}

function wosBg(value: number): string {
  if (value < 4) return "#FEF2F2";
  if (value < 8) return "#FFFBEB";
  if (value <= 15) return "#F0FDF4";
  return "#EFF6FF";
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const containerStyles = css`
  background: #F8FAFC;
  border-radius: 6px;
  border: 1px solid ${theme.colors.gray200};
  margin: 4px 16px 8px 40px;
  overflow-x: auto;
`;

const tableStyles = css`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  font-family: ${theme.typography.fontFamily};
  font-size: 12px;
`;

const thStyles = css`
  padding: 6px 10px;
  text-align: right;
  font-size: 10px;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray500};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${theme.colors.gray100};
  border-bottom: 1px solid ${theme.colors.gray200};
  white-space: nowrap;
`;

const thLabelStyles = css`
  ${thStyles}
  text-align: left;
  position: sticky;
  left: 0;
  z-index: 1;
  background: ${theme.colors.gray100};
  min-width: 200px;
`;

const tdStyles = (bg: string) => css`
  padding: 5px 10px;
  text-align: right;
  white-space: nowrap;
  border-bottom: 1px solid ${theme.colors.gray100};
  background: ${bg};
  font-variant-numeric: tabular-nums;
`;

const tdLabelStyles = (bg: string, color: string, bold?: boolean) => css`
  padding: 5px 10px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid ${theme.colors.gray100};
  position: sticky;
  left: 0;
  z-index: 1;
  background: ${bg === "transparent" ? "#F8FAFC" : bg};
  color: ${color};
  font-weight: ${bold ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  min-width: 200px;
`;

const valueStyles = (color: string, bold?: boolean) => css`
  color: ${color};
  font-weight: ${bold ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
`;

const wosBadgeStyles = (value: number) => css`
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: 11px;
  color: ${wosColor(value)};
  background: ${wosBg(value)};
  min-width: 32px;
  text-align: center;
`;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function SupplyWalkInline({ data }: SupplyWalkInlineProps) {
  const periods = useMemo(() => data.map((dp) => dp.period), [data]);

  if (data.length === 0) {
    return (
      <td colSpan={999}>
        <div css={css`padding: 12px 40px; color: ${theme.colors.gray400}; font-size: 12px;`}>
          No supply walk data available.
        </div>
      </td>
    );
  }

  return (
    <td colSpan={999} css={css`padding: 0 !important; background: ${theme.colors.gray50};`}>
      <div css={containerStyles}>
        <table css={tableStyles}>
          <thead>
            <tr>
              <th css={thLabelStyles}>Measure</th>
              {periods.map((p) => (
                <th key={p} css={thStyles}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEASURES.map((measure) => (
              <tr key={measure.key}>
                <td css={tdLabelStyles(measure.bg, measure.color, measure.bold)}>
                  {measure.label}
                </td>
                {data.map((dp, idx) => {
                  const prev = idx > 0 ? data[idx - 1] : undefined;
                  const value = measure.getValue(dp, prev);

                  if (measure.key === "wos") {
                    return (
                      <td key={dp.period} css={tdStyles("transparent")}>
                        <span css={wosBadgeStyles(value)}>
                          {value.toFixed(1)}
                        </span>
                      </td>
                    );
                  }

                  return (
                    <td key={dp.period} css={tdStyles(measure.bg)}>
                      <span css={valueStyles(measure.color, measure.bold)}>
                        {fmt(value, measure.prefix)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </td>
  );
}

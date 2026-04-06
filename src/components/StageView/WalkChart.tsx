/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { theme } from "../../styles/theme/theme";
import type { WalkDataPoint } from "./types";

interface WalkChartProps {
  data: WalkDataPoint[];
  title?: string;
}

const containerStyles = css`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  padding: 16px 20px 12px;
  margin-top: ${theme.spacing.md};
`;

const headerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const titleStyles = css`
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray800};
`;

const legendStyles = css`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 11px;
  color: ${theme.colors.gray500};
`;

const legendItemStyles = css`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const legendSwatchStyles = (color: string, dashed?: boolean) => css`
  width: 16px;
  height: ${dashed ? "0" : "10px"};
  border-radius: 2px;
  background: ${dashed ? "transparent" : color};
  ${dashed
    ? `
    border-top: 2px dashed ${color};
    margin-top: 0;
  `
    : ""}
`;

const numberFmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      css={css`
        background: ${theme.colors.white};
        border: 1px solid ${theme.colors.gray200};
        border-radius: ${theme.borderRadius.md};
        padding: 8px 12px;
        font-family: ${theme.typography.fontFamily};
        font-size: ${theme.typography.fontSize.xs};
        box-shadow: ${theme.shadows.sm};
      `}
    >
      <div
        css={css`
          font-weight: ${theme.typography.fontWeight.semibold};
          color: ${theme.colors.gray700};
          margin-bottom: 4px;
        `}
      >
        {label}
      </div>
      {payload.map((entry) => (
        <div
          key={entry.name}
          css={css`
            display: flex;
            justify-content: space-between;
            gap: 16px;
            color: ${entry.color};
          `}
        >
          <span>{entry.name}</span>
          <span css={css`font-weight: ${theme.typography.fontWeight.medium};`}>
            {numberFmt.format(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function WalkChart({ data, title }: WalkChartProps) {
  if (!data.length) return null;

  /* Determine reference area bounds from the first point */
  const targetMin = data[0]?.targetMin ?? 0;
  const targetMax = data[0]?.targetMax ?? 0;
  const safetyStock = data[0]?.safetyStock ?? 0;

  return (
    <div css={containerStyles}>
      <div css={headerStyles}>
        <span css={titleStyles}>
          {title ? `Supply Walk -- ${title}` : "Supply Walk"}
        </span>
        <div css={legendStyles}>
          <span css={legendItemStyles}>
            <span css={legendSwatchStyles("#3B82F6")} />
            Inventory
          </span>
          <span css={legendItemStyles}>
            <span css={legendSwatchStyles("#EF4444", true)} />
            Safety Stock
          </span>
          <span css={legendItemStyles}>
            <span css={legendSwatchStyles("rgba(34, 197, 94, 0.15)")} />
            Target WOS Band
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.colors.gray100}
            vertical={false}
          />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: theme.colors.gray400 }}
            axisLine={{ stroke: theme.colors.gray200 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: theme.colors.gray400 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => numberFmt.format(v)}
            width={56}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: theme.colors.gray300, strokeDasharray: "3 3" }}
          />

          {/* Target WOS band */}
          <ReferenceArea
            y1={targetMin}
            y2={targetMax}
            fill="rgba(34, 197, 94, 0.10)"
            stroke="none"
          />

          {/* Safety stock line */}
          <ReferenceLine
            y={safetyStock}
            stroke="#EF4444"
            strokeDasharray="6 3"
            strokeWidth={1.5}
          />

          {/* Inventory area */}
          <Area
            type="monotone"
            dataKey="inventory"
            name="Inventory"
            stroke="#3B82F6"
            fill="rgba(59, 130, 246, 0.12)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0, fill: "#3B82F6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

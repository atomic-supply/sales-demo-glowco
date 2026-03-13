/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC } from "react";
import { TableCell } from "../table";
import { WarningIcon } from "../warning-icon";
import { formatCurrency, formatNumber } from "../../../utils/format";
import { borders, theme } from "../../../styles";

export interface NumericCellProps {
  /** The numeric value to display (optional if proposedValue/correctedValue provided) */
  value?: number | null | undefined;
  diff?: number | null | undefined;
  /** Proposed/original value - used with correctedValue to auto-calculate display and diff */
  proposedValue?: number | null | undefined;
  /** Corrected value - takes priority over value if provided */
  correctedValue?: number | null | undefined;
  /** Hide diff when corrected equals proposed (no meaningful change) */
  hideDiffWhenMatchesProposed?: boolean;
  format?: "number" | "currency";
  warningCount?: number;
  warningMessages?: string[];
  hasAnyWarning?: boolean;
  isLast: boolean;
  align?: "left" | "right" | "center";
}

/**
 * NumericCell component for displaying numeric values in tables.
 * Supports diff display, warnings, and flexible formatting.
 * 
 * @param value - The numeric value to display (used if correctedValue not provided)
 * @param diff - Optional diff value to show in parentheses (auto-calculated if proposedValue/correctedValue provided)
 * @param proposedValue - Original/proposed value for comparison
 * @param correctedValue - Corrected value (takes priority over value)
 * @param hideDiffWhenMatchesProposed - Hide diff when corrected equals proposed (default: false)
 * @param format - Format type: "number" or "currency" (defaults to "number")
 * @param warningCount - Number of warnings (0 hides warning icon)
 * @param warningMessages - Array of warning messages for tooltip
 * @param hasAnyWarning - Whether to highlight the cell with warning background
 * @param isLast - Whether this is the last column
 * @param align - Text alignment (defaults to "right")
 */
export const NumericCell: FC<NumericCellProps> = ({
  value,
  diff: providedDiff,
  proposedValue,
  correctedValue,
  hideDiffWhenMatchesProposed = false,
  format = "number",
  warningCount = 0,
  warningMessages = [],
  hasAnyWarning = false,
  isLast,
  align = "right",
}) => {
  // Calculate display value: correctedValue takes priority, then value, then proposedValue
  const displayValue =
    correctedValue !== null && correctedValue !== undefined
      ? correctedValue
      : value !== null && value !== undefined
        ? value
        : proposedValue;

  // Calculate diff if proposedValue and correctedValue are provided
  let calculatedDiff: number | null = null;
  if (proposedValue !== null && proposedValue !== undefined && correctedValue !== null && correctedValue !== undefined) {
    const matchesProposed = hideDiffWhenMatchesProposed && Math.abs(correctedValue - proposedValue) < 0.001;
    if (!matchesProposed) {
      calculatedDiff = correctedValue - proposedValue;
    }
  }

  // Use provided diff if given, otherwise use calculated diff
  const diff = providedDiff !== undefined ? providedDiff : calculatedDiff;

  if (displayValue == null) {
    return (
      <TableCell
        css={css`
          padding: 0.5rem 0.75rem;
          text-align: ${align};
          white-space: nowrap;
          font-size: 0.875rem;
          background-color: ${hasAnyWarning ? theme.colors.orange50 : "transparent"};
          ${!isLast ? borders.right : ""}
          ${borders.bottom}
        `}
      >
        —
      </TableCell>
    );
  }

  const formatValue = format === "currency" ? formatCurrency : formatNumber;
  const formattedValue = formatValue(displayValue);
  const diffFormatted =
    diff != null && Math.abs(diff) > 0.01 ? (diff > 0 ? `+${formatValue(diff)}` : formatValue(diff)) : null;

  return (
    <TableCell
      css={css`
        padding: 0.5rem 0.75rem;
        text-align: ${align};
        white-space: nowrap;
        font-size: 0.875rem;
        background-color: ${hasAnyWarning ? theme.colors.orange50 : "transparent"};
        ${!isLast ? borders.right : ""}
        ${borders.bottom}
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: ${align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start"};
          gap: 0.25rem;
        `}
      >
        {diffFormatted ? (
          <span>
            {formattedValue}{" "}
            <span
              css={css`
                color: #6b7280;
                font-size: 0.8125rem;
              `}
            >
              ({diffFormatted})
            </span>
          </span>
        ) : (
          <span>{formattedValue}</span>
        )}
        {warningCount > 0 && <WarningIcon count={warningCount} messages={warningMessages} />}
      </div>
    </TableCell>
  );
};

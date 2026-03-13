/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC, type ReactNode } from "react";
import { TableCell } from "../table";
import { formatNumber } from "../../../utils/format";
import { formatUtcDate } from "../../../utils/date";
import { borders, theme } from "../../../styles";

export interface StandardCellProps {
  value: unknown;
  columnKey?: string;
  hasAnyWarning?: boolean;
  isLast: boolean;
  align?: "left" | "right" | "center";
  isNumeric?: boolean;
  formatDate?: boolean;
  dateFormat?: {
    month?: "2-digit" | "numeric";
    day?: "2-digit" | "numeric";
    year?: "2-digit" | "numeric";
  };
  renderValue?: (value: unknown, columnKey?: string) => ReactNode;
}

/**
 * StandardCell component for displaying standard table cell content.
 * Handles text, numbers, dates, and custom rendering.
 * 
 * @param value - The value to display
 * @param columnKey - Optional column key for special formatting
 * @param hasAnyWarning - Whether to highlight the cell with warning background
 * @param isLast - Whether this is the last column
 * @param align - Text alignment (defaults to "left")
 * @param isNumeric - Whether to format as number (overrides auto-detection)
 * @param formatDate - Whether to format as date
 * @param dateFormat - Date format options
 * @param renderValue - Optional custom render function
 */
export const StandardCell: FC<StandardCellProps> = ({
  value,
  columnKey,
  hasAnyWarning = false,
  isLast,
  align = "left",
  isNumeric,
  formatDate = false,
  dateFormat = {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  },
  renderValue,
}) => {
  let displayValue: ReactNode = "—";

  if (renderValue) {
    displayValue = renderValue(value, columnKey);
  } else if (formatDate || columnKey === "DELIVERY_DATE") {
    // Format date as UTC calendar date
    const formatted = formatUtcDate(value as number | string | Date | null | undefined, dateFormat);
    // Convert slashes to dashes for mm-dd-yy format
    displayValue = formatted
      ? formatted.replace(/\//g, "-")
      : value != null
        ? String(value)
        : "—";
  } else if (isNumeric && value != null && value !== "") {
    // Format all numeric columns in US format
    displayValue = formatNumber(value as number);
  } else if (value != null && value !== "") {
    displayValue = String(value);
  }

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
      {displayValue}
    </TableCell>
  );
};

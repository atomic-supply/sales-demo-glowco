/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC } from "react";
import { TableCell } from "../table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { borders, theme } from "../../../styles";

export interface StatusConfig {
  color: string;
  label: string;
}

export interface StatusCellProps {
  status: string | null | undefined;
  statusConfig: Record<string, StatusConfig>;
  defaultStatus?: string;
  hasAnyWarning?: boolean;
  isLast: boolean;
}

/**
 * StatusCell component for displaying status indicators in tables.
 * Shows a colored dot with tooltip based on status configuration.
 * 
 * @param status - The status value
 * @param statusConfig - Map of status values to color/label configs
 * @param defaultStatus - Default status if status is null/undefined
 * @param hasAnyWarning - Whether to highlight the cell with warning background
 * @param isLast - Whether this is the last column
 */
export const StatusCell: FC<StatusCellProps> = ({
  status,
  statusConfig,
  defaultStatus,
  hasAnyWarning = false,
  isLast,
}) => {
  const statusKey = status ?? defaultStatus ?? "";
  const config = statusConfig[statusKey] ?? statusConfig[defaultStatus ?? ""] ?? {
    color: "#9ca3af",
    label: "Unknown",
  };

  return (
    <TableCell
      css={css`
        padding: 0.5rem 0.75rem;
        text-align: center;
        white-space: nowrap;
        font-size: 0.875rem;
        background-color: ${hasAnyWarning ? theme.colors.orange50 : "transparent"};
        ${!isLast ? borders.right : ""}
        ${borders.bottom}
      `}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: help;
            `}
          >
            <div
              css={css`
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-color: ${config.color};
              `}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TableCell>
  );
};

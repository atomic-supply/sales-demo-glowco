/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC, type ReactNode } from "react";
import { TableCell } from "../table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { borders, theme } from "../../../styles";

export interface ActionButtonCellProps {
  icon: ReactNode;
  onClick?: () => void;
  tooltip?: string;
  hasAnyWarning?: boolean;
  isLast: boolean;
  align?: "left" | "right" | "center";
  /** Override the button background color (e.g. to match row highlight). */
  buttonBackgroundColor?: string;
}

/**
 * ActionButtonCell component for displaying action buttons in table cells.
 * Generic component that can be used for details buttons, edit buttons, etc.
 * 
 * @param icon - Icon component to display in the button
 * @param onClick - Click handler for the button
 * @param tooltip - Tooltip text to show on hover
 * @param hasAnyWarning - Whether to highlight the cell with warning background
 * @param isLast - Whether this is the last column
 * @param align - Button alignment (defaults to "left")
 */
export const ActionButtonCell: FC<ActionButtonCellProps> = ({
  icon,
  onClick,
  tooltip,
  hasAnyWarning = false,
  isLast,
  align = "left",
  buttonBackgroundColor,
}) => {
  const button = (
    <button
      onClick={onClick}
      css={css`
        border: 1px solid oklch(0.922 0 0);
        background-color: ${buttonBackgroundColor ?? "oklch(1 0 0)"};
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        color: oklch(0.205 0 0);
        padding: 0.375rem;
        border-radius: 0.375rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: oklch(0.97 0 0);
          color: oklch(0.205 0 0);
        }

        &:active {
          background-color: oklch(0.97 0 0);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}
    >
      {icon}
    </button>
  );

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
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}
    </TableCell>
  );
};

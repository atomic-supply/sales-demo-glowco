/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC } from "react";
import { Checkbox } from "../checkbox";
import { TableCell } from "../table";
import { borders, theme } from "../../../styles";

export interface CheckboxCellProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  isLast: boolean;
  checkedColor?: string;
}

/**
 * CheckboxCell component for table row selection.
 * Displays a checkbox in a table cell with consistent styling.
 * 
 * @param checked - Whether the checkbox is checked
 * @param onCheckedChange - Callback when checkbox state changes
 * @param isLast - Whether this is the last column
 * @param checkedColor - Optional color for checked state (defaults to gray)
 */
export const CheckboxCell: FC<CheckboxCellProps> = ({
  checked,
  onCheckedChange,
  isLast,
  checkedColor = "#6b7280",
}) => {
  return (
    <TableCell
      css={css`
        font-size: 0.875rem;
        text-align: center;
        background-color: transparent;
        ${!isLast ? borders.right : ""}
        ${borders.bottom}
        width: 40px;
        min-width: 40px;
        max-width: 40px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          css={css`
            cursor: pointer;
            &[data-state="checked"] {
              background-color: ${checkedColor};
              border-color: ${checkedColor};
              & [data-slot="checkbox-indicator"] {
                display: none;
              }
            }
            &[data-state="unchecked"] {
              background-color: white;
              border-color: ${theme.colors.gray200};
            }
          `}
        />
      </div>
    </TableCell>
  );
};

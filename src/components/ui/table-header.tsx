/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC, type ReactNode } from "react";
import { Checkbox } from "./checkbox";
import { TableHead } from "./table";
import { borders, theme } from "../../styles";

export interface TableColumn {
  key: string;
  label?: string;
}

export interface TableHeaderProps {
  columns: TableColumn[];
  numericColumns?: readonly string[];
  areAllRowsSelected?: boolean;
  onSelectAll?: (checked: boolean | "indeterminate") => void;
  showAsterisk?: (columnKey: string) => boolean;
  showCaret?: (columnKey: string) => boolean;
  caretIcon?: ReactNode;
  backgroundColor?: string;
  renderColumnHeader?: (column: TableColumn, index: number) => ReactNode;
  getColumnStyles?: (
    column: TableColumn,
    index: number
  ) => ReturnType<typeof css> | string | undefined;
}

/**
 * TableHeader component for displaying table headers with consistent styling.
 * Supports checkboxes, numeric alignment, asterisks, and custom column rendering.
 * 
 * @param columns - Array of column definitions with key and optional label
 * @param numericColumns - Array of column keys that should be right-aligned
 * @param areAllRowsSelected - Whether all rows are selected (for checkbox)
 * @param onSelectAll - Callback for select all checkbox
 * @param showAsterisk - Function to determine if column should show asterisk
 * @param showCaret - Function to determine if column should show caret
 * @param caretIcon - Custom caret icon component
 * @param backgroundColor - Background color for header row
 * @param renderColumnHeader - Optional function to fully customize column header rendering
 */
export const TableHeader: FC<TableHeaderProps> = ({
  columns,
  numericColumns = [],
  areAllRowsSelected = false,
  onSelectAll,
  showAsterisk,
  showCaret,
  caretIcon,
  backgroundColor = "#f9fafb",
  renderColumnHeader,
  getColumnStyles,
}) => {
  return (
    <tr
      css={css`
        background-color: ${backgroundColor};
        position: relative;
        z-index: 11;
        ${borders.bottom}
        isolation: isolate;
      `}
    >
      {columns.map((col, idx) => {
        const isCheckbox = col.key === "_CHECKBOX";
        const isNumeric = numericColumns.includes(col.key);
        const isLastColumn = idx === columns.length - 1;

        // Use custom renderer if provided
        if (renderColumnHeader) {
          const customStyles = getColumnStyles ? getColumnStyles(col, idx) : undefined;
          return (
            <TableHead
              key={col.key}
              css={[
                css`
                  padding: 0.125rem 0.25rem;
                  font-weight: 500;
                  color: #374151;
                  cursor: default;
                  user-select: none;
                  white-space: nowrap;
                  background-color: ${backgroundColor};
                  background-clip: padding-box;
                  position: relative;
                  z-index: 12;
                  ${borders.top}
                  ${!isLastColumn ? borders.right : ""}
                  ${borders.bottom}
                `,
                typeof customStyles === "string"
                  ? css`
                      ${customStyles}
                    `
                  : customStyles,
              ]}
            >
              {renderColumnHeader(col, idx)}
            </TableHead>
          );
        }

        return (
          <TableHead
            key={col.key}
            css={css`
              ${isCheckbox
                ? "width: 40px; min-width: 40px; max-width: 40px; text-align: center;"
                : ""}
              ${isNumeric ? "text-align: right;" : ""}
              padding: 0.125rem 0.25rem;
              font-weight: 500;
              color: #374151;
              cursor: default;
              user-select: none;
              white-space: nowrap;
              background-color: ${backgroundColor};
              background-clip: padding-box;
              position: relative;
              z-index: 12;
              ${borders.top}
              ${!isLastColumn ? borders.right : ""}
              ${borders.bottom}
            `}
          >
            {isCheckbox ? (
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <Checkbox
                  checked={areAllRowsSelected}
                  onCheckedChange={onSelectAll}
                  css={css`
                    cursor: pointer;
                    &[data-state="checked"] {
                      background-color: #6b7280;
                      border-color: #6b7280;
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
            ) : (
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  gap: 0.25rem;
                  ${isNumeric ? "justify-content: flex-end;" : ""}
                `}
              >
                {col.label}
                {showAsterisk && showAsterisk(col.key) && (
                  <span
                    css={css`
                      color: #3b82f6;
                      font-weight: 600;
                      font-size: 0.875rem;
                    `}
                  >
                    *
                  </span>
                )}
                {showCaret && showCaret(col.key) && caretIcon}
              </div>
            )}
          </TableHead>
        );
      })}
    </tr>
  );
};

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC, type HTMLAttributes } from "react";
import { TableCell } from "./table";
import { theme } from "../../styles";

export interface TableEmptyStateProps {
  message: string;
  colSpan: number;
  height?: number;
  className?: string;
}

/**
 * Generic empty state component for table bodies.
 * Renders a centered message when a table has no data.
 */
export const TableEmptyState: FC<
  TableEmptyStateProps & HTMLAttributes<HTMLTableSectionElement>
> = ({ message, colSpan, height = 240, className, ...tbodyProps }) => {
  return (
    <tbody
      {...tbodyProps}
      className={className}
      css={css`
        & tr:last-child {
          border: 0;
        }
      `}
    >
      <tr
        css={css`
          height: ${height}px;
        `}
      >
        <TableCell
          colSpan={colSpan}
          css={css`
            text-align: center;
            padding: 2rem;
            color: ${theme.colors.gray500};
            font-size: 0.875rem;
            height: 100%;
            vertical-align: middle;
          `}
        >
          <div>{message}</div>
        </TableCell>
      </tr>
    </tbody>
  );
};

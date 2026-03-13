/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC, type HTMLAttributes } from "react";
import { TableCell } from "./table";
import { borders, theme } from "../../styles";

export interface TableLoadingStateProps {
  message: string;
  colSpan: number;
  height?: number;
  spinnerSize?: number;
  className?: string;
}

/**
 * Generic loading state component for table bodies.
 * Renders a spinner with message when table data is loading.
 */
export const TableLoadingState: FC<
  TableLoadingStateProps & HTMLAttributes<HTMLTableSectionElement>
> = ({
  message,
  colSpan,
  height = 240,
  spinnerSize = 2,
  className,
  ...tbodyProps
}) => {
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
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              align-items: center;
              justify-content: center;
              height: 100%;
            `}
          >
            <div
              css={css`
                width: ${spinnerSize}rem;
                height: ${spinnerSize}rem;
                ${borders.standard}
                border-top-color: ${theme.colors.blue500};
                border-radius: 50%;
                animation: spin 1s linear infinite;
                @keyframes spin {
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}
            />
            <div>{message}</div>
          </div>
        </TableCell>
      </tr>
    </tbody>
  );
};

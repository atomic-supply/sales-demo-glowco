/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC, type HTMLAttributes } from "react";
import { theme } from "../../styles";
import { TableCell } from "./table";

export interface TableErrorStateProps {
  error: Error | { message?: string } | string;
  colSpan: number;
  height?: number;
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Generic error state component for table bodies.
 * Renders an error message when table data fails to load, with a retry/refresh button.
 */
export const TableErrorState: FC<
  TableErrorStateProps & HTMLAttributes<HTMLTableSectionElement>
> = ({
  error,
  colSpan,
  height = 300,
  title = "Error loading data",
  actionLabel = "Refresh Page",
  onAction,
  className,
  ...tbodyProps
}) => {
  const errorMessage =
    typeof error === "string" ? error : error?.message || "An unexpected error occurred.";

  const handleAction = onAction ?? (() => window.location.reload());

  return (
    <tbody
      {...tbodyProps}
      className={className}
      css={css`
        & tr:last-child {
          border: 0;
        }
      `}
      style={{ margin: 0, padding: 0 }}
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
            color: ${theme.colors.status.error};
            font-size: 0.875rem;
            height: ${height}px;
            vertical-align: middle;
            max-width: 100%;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
              align-items: center;
              justify-content: center;
              height: 100%;
              max-width: 100%;
            `}
          >
            <div
              css={css`
                font-weight: 500;
              `}
            >
              {title}
            </div>
            <div
              css={css`
                color: ${theme.colors.gray500};
                font-size: 0.75rem;
                max-width: 100%;
                word-wrap: break-word;
                word-break: break-word;
                overflow-wrap: break-word;
                white-space: normal;
                text-align: center;
              `}
            >
              {errorMessage}
            </div>
            <button
              type="button"
              onClick={handleAction}
              css={css`
                margin-top: 0.25rem;
                padding: 0.375rem 0.75rem;
                font-size: 0.75rem;
                font-weight: 500;
                color: ${theme.colors.gray700};
                background-color: ${theme.colors.white};
                border: 1px solid ${theme.colors.gray300};
                border-radius: ${theme.borderRadius.sm};
                cursor: pointer;
                transition:
                  background-color 0.15s,
                  border-color 0.15s;

                &:hover {
                  background-color: ${theme.colors.gray50};
                  border-color: ${theme.colors.gray400};
                }
              `}
            >
              {actionLabel}
            </button>
          </div>
        </TableCell>
      </tr>
    </tbody>
  );
};

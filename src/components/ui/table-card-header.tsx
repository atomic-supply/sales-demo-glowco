/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC, type ReactNode } from "react";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { borders } from "../../styles";

export interface TableCardHeaderProps {
  title: string;
  description: string;
  loading?: boolean;
  refreshing?: boolean;
  actions?: ReactNode;
  spinnerColor?: string;
}

/**
 * TableCardHeader component for displaying table card headers with consistent styling.
 * Used across all table components in the BuyerOps section.
 * 
 * @param title - Table title
 * @param description - Table description text
 * @param loading - Whether the table is loading
 * @param refreshing - Whether the table is refreshing
 * @param actions - Optional action buttons or content to display on the right side
 * @param spinnerColor - Optional color for the loading spinner (defaults to blue)
 */
export const TableCardHeader: FC<TableCardHeaderProps> = ({
  title,
  description,
  loading = false,
  refreshing = false,
  actions,
  spinnerColor = "#3b82f6",
}) => {
  return (
    <CardHeader
      css={css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-shrink: 0;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
      `}
    >
      <div
        css={css`
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 0.5rem;
          `}
        >
          <CardTitle
            css={css`
              font-size: 0.9375rem;
              margin: 0;
              padding: 0;
              line-height: 1.2;
            `}
          >
            {title}
          </CardTitle>
          {(loading || refreshing) && (
            <div
              css={css`
                width: 0.9375rem;
                height: 0.9375rem;
                ${borders.standard}
                border-top-color: ${spinnerColor};
                border-radius: 50%;
                animation: spin 1s linear infinite;
                @keyframes spin {
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}
              aria-hidden
            />
          )}
        </div>
        <CardDescription
          css={css`
            font-size: 0.75rem;
            margin: 0;
            margin-top: 0.0625rem;
            margin-bottom: 0;
            padding: 0;
            line-height: 1.2;
          `}
        >
          {description}
        </CardDescription>
      </div>
      {actions && (
        <div
          css={css`
            display: flex;
            gap: 0.5rem;
            align-items: center;
            flex-shrink: 0;
          `}
        >
          {actions}
        </div>
      )}
    </CardHeader>
  );
};

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC, type ReactNode } from "react";
import { formatNumber } from "../../utils/format";
import { borders, theme } from "../../styles";

export interface TableFooterProps {
  rowCount?: number;
  leftContent?: ReactNode | null; // null to hide default, undefined to show default, ReactNode to override
  rightContent?: ReactNode;
}

/**
 * TableFooter component for displaying table footers with consistent styling.
 * Supports custom left and right content, with optional row count display.
 * 
 * Default leftContent shows: "* diff from proposed values shown in parenthesis"
 * 
 * @param rowCount - Number of rows (will be formatted and displayed on right if rightContent not provided)
 * @param leftContent - Custom content for left side. undefined = show default, null = hide, ReactNode = override
 * @param rightContent - Custom content for right side (defaults to row count if rowCount provided)
 */
export const TableFooter: FC<TableFooterProps> = ({
  rowCount,
  leftContent,
  rightContent,
}) => {
  const defaultRightContent =
    rowCount !== undefined ? (
      <span>
        {formatNumber(rowCount)} {rowCount === 1 ? "row" : "rows"}
      </span>
    ) : null;

  // Default left content: asterisk explanation (used by all BuyerOps tables)
  const defaultLeftContent = (
    <>
      <span
        css={css`
          color: ${theme.colors.blue500};
          font-weight: 600;
          font-size: 0.875rem;
        `}
      >
        *
      </span>
      diff from proposed values shown in parenthesis
    </>
  );

  // Show default if leftContent is undefined, hide if null, show custom if provided
  const displayLeftContent = leftContent === undefined ? defaultLeftContent : leftContent;

  return (
    <div
      css={css`
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        color: #6b7280;
        display: flex;
        justify-content: space-between;
        align-items: center;
        ${borders.top}
      `}
    >
      {displayLeftContent && (
        <span
          css={css`
            font-size: 0.8125rem;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          `}
        >
          {displayLeftContent}
        </span>
      )}
      {(rightContent || defaultRightContent) && (
        <span>{rightContent ?? defaultRightContent}</span>
      )}
    </div>
  );
};

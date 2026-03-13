/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC } from "react";

export interface InlineLoadingStateProps {
  message: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  padding?: string;
  className?: string;
}

/**
 * Generic inline loading state component for smaller contexts.
 * Used for inline loading messages within components.
 */
export const InlineLoadingState: FC<InlineLoadingStateProps> = ({
  message,
  backgroundColor = "#f9fafb",
  textColor = "#6b7280",
  fontSize = "0.875rem",
  padding = "1rem",
  className,
}) => {
  return (
    <div
      className={className}
      css={css`
        background-color: ${backgroundColor};
        text-align: center;
        color: ${textColor};
        font-size: ${fontSize};
        padding: ${padding};
      `}
    >
      {message}
    </div>
  );
};

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type FC } from "react";
import { theme } from "../../styles";

export interface InlineErrorStateProps {
  error: Error | { message?: string } | string;
  prefix?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  padding?: string;
  className?: string;
}

/**
 * Generic inline error state component for smaller contexts.
 * Used for inline error messages within components.
 */
export const InlineErrorState: FC<InlineErrorStateProps> = ({
  error,
  prefix = "Error",
  backgroundColor = "#fee2e2",
  textColor,
  fontSize = "0.875rem",
  padding = "1rem",
  className,
}) => {
  const errorMessage =
    typeof error === "string" ? error : error?.message || "An unexpected error occurred.";

  return (
    <div
      className={className}
      css={css`
        background-color: ${backgroundColor};
        text-align: center;
        color: ${textColor || theme.colors.status.error};
        font-size: ${fontSize};
        padding: ${padding};
      `}
    >
      {prefix}: {errorMessage}
    </div>
  );
};

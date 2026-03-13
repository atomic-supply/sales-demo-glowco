/** @jsxImportSource @emotion/react */
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const textareaStyles = css`
  display: flex;
  min-height: 80px;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid oklch(0.922 0 0);
  background-color: oklch(1 0 0);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;

  &::placeholder {
    color: oklch(0.556 0 0);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px oklch(0.708 0 0),
      0 0 0 4px oklch(1 0 0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  css?: Interpolation<Theme>;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, css: cssProp, ...props }, ref) => {
    return <textarea css={[textareaStyles, cssProp]} className={className} ref={ref} {...props} />;
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

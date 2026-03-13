/** @jsxImportSource @emotion/react */
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import * as React from "react";

const inputStyles = css`
  display: flex;
  height: 2.25rem;
  width: 100%;
  min-width: 0;
  border-radius: 0.375rem;
  border: 1px solid oklch(0.922 0 0);
  background-color: transparent;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition:
    color 0.2s,
    box-shadow 0.2s;
  outline: none;

  &::placeholder {
    color: oklch(0.556 0 0);
  }

  &::selection {
    background-color: oklch(0.205 0 0);
    color: oklch(0.985 0 0);
  }

  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    border-color: oklch(0.708 0 0);
    box-shadow: 0 0 0 3px oklch(0.708 0 0 / 0.5);
  }

  &[aria-invalid="true"] {
    border-color: oklch(0.577 0.245 27.325);
    box-shadow: 0 0 0 3px oklch(0.577 0.245 27.325 / 0.2);
  }

  &::file-selector-button {
    color: oklch(0.145 0 0);
    height: 1.75rem;
    border: 0;
    background-color: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    display: inline-flex;
  }
`;

function Input({
  className,
  type,
  css: cssProp,
  ...props
}: React.ComponentProps<"input"> & { css?: Interpolation<Theme> }) {
  return (
    <input
      type={type}
      data-slot="input"
      css={[inputStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export { Input };

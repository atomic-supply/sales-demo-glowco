/** @jsxImportSource @emotion/react */
"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const toggleBaseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background-color: oklch(0.97 0 0);
    color: oklch(0.556 0 0);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-state="on"] {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  & svg {
    pointer-events: none;

    &:not([class*="size-"]) {
      width: 1rem;
      height: 1rem;
    }

    flex-shrink: 0;
  }

  &:focus-visible {
    border-color: oklch(0.556 0 0);
    box-shadow: 0 0 0 3px oklch(0.556 0 0 / 0.5);
    outline: none;
  }

  &[aria-invalid="true"] {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
  }

  transition:
    color 0.2s,
    box-shadow 0.2s;
`;

const toggleDefaultStyles = css`
  background-color: transparent;
`;

const toggleOutlineStyles = css`
  border: 1px solid #d1d5db;
  background-color: transparent;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }
`;

const toggleSizeDefaultStyles = css`
  height: 2.25rem;
  padding: 0 0.5rem;
  min-width: 2.25rem;
`;

const toggleSizeSmStyles = css`
  height: 2rem;
  padding: 0 0.375rem;
  min-width: 2rem;
`;

const toggleSizeLgStyles = css`
  height: 2.5rem;
  padding: 0 0.625rem;
  min-width: 2.5rem;
`;

type ToggleVariant = "default" | "outline";
type ToggleSize = "default" | "sm" | "lg";

function Toggle({
  className,
  variant = "default",
  size = "default",
  css: cssProp,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
  css?: Interpolation<Theme>;
}) {
  const variantStyles = variant === "outline" ? toggleOutlineStyles : toggleDefaultStyles;
  const sizeStyles = {
    default: toggleSizeDefaultStyles,
    sm: toggleSizeSmStyles,
    lg: toggleSizeLgStyles,
  }[size];

  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      css={[toggleBaseStyles, variantStyles, sizeStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export { Toggle };

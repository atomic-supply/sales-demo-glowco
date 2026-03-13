/** @jsxImportSource @emotion/react */
"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
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

const ToggleGroupContext = React.createContext<{
  size?: ToggleSize;
  variant?: ToggleVariant;
}>({
  size: "default",
  variant: "default",
});

const toggleGroupRootStyles = css`
  display: flex;
  width: fit-content;
  align-items: center;
  border-radius: 0.375rem;

  &[data-variant="outline"] {
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }
`;

function ToggleGroup({
  className,
  variant,
  size,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
  css?: Interpolation<Theme>;
}) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      css={[toggleGroupRootStyles, cssProp]}
      className={className}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

const toggleGroupItemStyles = css`
  min-width: 0;
  flex: 1;
  flex-shrink: 0;
  border-radius: 0;
  box-shadow: none;

  &:first-child {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }

  &:last-child {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }

  &:focus {
    z-index: 10;
  }

  &:focus-visible {
    z-index: 10;
  }

  &[data-variant="outline"] {
    border-left: 0;

    &:first-child {
      border-left: 1px solid #d1d5db;
    }
  }
`;

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
  css?: Interpolation<Theme>;
}) {
  const context = React.useContext(ToggleGroupContext);
  const finalVariant = context.variant || variant || "default";
  const finalSize = context.size || size || "default";

  const variantStyles = finalVariant === "outline" ? toggleOutlineStyles : toggleDefaultStyles;
  const sizeStyles = {
    default: toggleSizeDefaultStyles,
    sm: toggleSizeSmStyles,
    lg: toggleSizeLgStyles,
  }[finalSize];

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={finalVariant}
      data-size={finalSize}
      css={[toggleBaseStyles, variantStyles, sizeStyles, toggleGroupItemStyles, cssProp]}
      className={className}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };

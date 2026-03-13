/** @jsxImportSource @emotion/react */
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

const baseBadgeStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
  gap: 0.25rem;
  transition:
    color 0.2s,
    box-shadow 0.2s;
  overflow: hidden;

  & > svg {
    width: 0.75rem;
    height: 0.75rem;
    pointer-events: none;
  }

  &:focus-visible {
    border-color: oklch(0.708 0 0);
    box-shadow: 0 0 0 3px oklch(0.708 0 0 / 0.5);
  }

  &[aria-invalid="true"] {
    border-color: oklch(0.577 0.245 27.325);
    box-shadow: 0 0 0 3px oklch(0.577 0.245 27.325 / 0.2);
  }

  & a&:hover {
    /* hover styles applied via variant */
  }
`;

const badgeVariantStyles: Record<string, Interpolation<Theme>> = {
  default: css`
    border-color: transparent;
    background-color: oklch(0.205 0 0);
    color: oklch(0.985 0 0);

    & a&:hover {
      background-color: oklch(0.205 0 0 / 0.9);
    }
  `,
  secondary: css`
    border-color: transparent;
    background-color: oklch(0.97 0 0);
    color: oklch(0.205 0 0);

    & a&:hover {
      background-color: oklch(0.97 0 0 / 0.9);
    }
  `,
  destructive: css`
    border-color: transparent;
    background-color: oklch(0.577 0.245 27.325);
    color: white;

    & a&:hover {
      background-color: oklch(0.577 0.245 27.325 / 0.9);
    }

    &:focus-visible {
      box-shadow: 0 0 0 3px oklch(0.577 0.245 27.325 / 0.2);
    }
  `,
  outline: css`
    border: 1px solid #d1d5db;
    background-color: white;
    color: #374151;

    & a&:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
      color: #111827;
    }
  `,
};

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

function Badge({
  className,
  variant = "default",
  asChild = false,
  css: cssProp,
  ...props
}: React.ComponentProps<"span"> & {
  variant?: BadgeVariant;
  asChild?: boolean;
  css?: Interpolation<Theme>;
}) {
  const emotionStyles = [baseBadgeStyles, badgeVariantStyles[variant], cssProp];

  if (asChild) {
    return <Slot data-slot="badge" className={className} {...props} />;
  }

  return <span data-slot="badge" css={emotionStyles} className={className} {...props} />;
}

export { Badge };

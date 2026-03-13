/** @jsxImportSource @emotion/react */
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import { theme } from "../../styles/theme/theme";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  outline: none;
  flex-shrink: 0;
  cursor: pointer;
  border: 1px solid transparent;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  &:focus-visible {
    border-color: oklch(0.708 0 0);
    box-shadow: 0 0 0 3px oklch(0.708 0 0 / 0.5);
  }

  &[aria-invalid="true"] {
    border-color: oklch(0.577 0.245 27.325);
    box-shadow: 0 0 0 3px oklch(0.577 0.245 27.325 / 0.2);
  }
`;

const variantStyles: Record<string, Interpolation<Theme>> = {
  default: css`
    background-color: oklch(0.205 0 0);
    color: oklch(0.985 0 0);
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background-color: oklch(0.205 0 0 / 0.9);
    }
  `,
  primary: css`
    background-color: ${theme.colors.blue600};
    color: ${theme.colors.white};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background-color: ${theme.colors.blue700};
    }
  `,
  secondary: css`
    background-color: ${theme.colors.gray700};
    color: ${theme.colors.white};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background-color: ${theme.colors.gray500};
    }
  `,
  tertiary: css`
    background-color: transparent;
    color: ${theme.colors.gray700};
    border-color: ${theme.colors.gray300};

    &:hover {
      background-color: ${theme.colors.gray50};
    }
  `,
  destructive: css`
    background-color: oklch(0.577 0.245 27.325);
    color: white;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background-color: oklch(0.577 0.245 27.325 / 0.9);
    }

    &:focus-visible {
      box-shadow: 0 0 0 3px oklch(0.577 0.245 27.325 / 0.2);
    }
  `,
  outline: css`
    border-color: oklch(0.922 0 0);
    background-color: oklch(1 0 0);
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background-color: oklch(0.97 0 0);
      color: oklch(0.205 0 0);
    }
  `,
  ghost: css`
    &:hover {
      background-color: oklch(0.97 0 0);
      color: oklch(0.205 0 0);
    }
  `,
  link: css`
    color: oklch(0.205 0 0);
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover {
      text-decoration: underline;
    }
  `,
};

const sizeStyles: Record<string, Interpolation<Theme>> = {
  default: css`
    height: 2.25rem;
    padding: 0.5rem 1rem;

    &:has(> svg) {
      padding-left: 0.75rem;
    }
  `,
  sm: css`
    height: 2rem;
    border-radius: 0.375rem;
    gap: 0.375rem;
    padding: 0 0.75rem;

    &:has(> svg) {
      padding-left: 0.625rem;
    }
  `,
  lg: css`
    height: 2.5rem;
    border-radius: 0.375rem;
    padding: 0 1.5rem;

    &:has(> svg) {
      padding-left: 1rem;
    }
  `,
  icon: css`
    width: 2.25rem;
    height: 2.25rem;
  `,
};

type ButtonVariant = "default" | "primary" | "secondary" | "tertiary" | "destructive" | "outline" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  css: cssProp,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  css?: Interpolation<Theme>;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      css={[baseButtonStyles, variantStyles[variant], sizeStyles[size], cssProp]}
      className={className}
      {...props}
    />
  );
}

export { Button };

/** @jsxImportSource @emotion/react */
"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const sizes = {
  default: {
    box: css`width: 1rem; height: 1rem;`,
    icon: css`width: 0.875rem; height: 0.875rem;`,
  },
  sm: {
    box: css`width: 0.75rem; height: 0.75rem;`,
    icon: css`width: 0.625rem; height: 0.625rem;`,
  },
} as const;

type CheckboxSize = keyof typeof sizes;

const checkboxBaseStyles = css`
  flex-shrink: 0;
  border-radius: 3px;
  border: 1px solid #d1d5db;
  background-color: oklch(0.97 0 0 / 0.3);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: box-shadow 0.2s;
  outline: none;
  cursor: pointer;
  vertical-align: middle;

  &:focus-visible {
    border-color: oklch(0.556 0 0);
    box-shadow: 0 0 0 3px oklch(0.556 0 0 / 0.5);
  }

  &[data-state="checked"] {
    background-color: oklch(0.205 0 0);
    color: oklch(1 0 0);
    border-color: oklch(0.205 0 0);
  }

  &[aria-invalid="true"] {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const checkboxIndicatorStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
  transition: none;
`;

function Checkbox({
  className,
  css: cssProp,
  size = "default",
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  css?: Interpolation<Theme>;
  size?: CheckboxSize;
}) {
  const s = sizes[size];
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      css={[checkboxBaseStyles, s.box, cssProp]}
      className={className}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" css={checkboxIndicatorStyles}>
        <CheckIcon css={s.icon} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
export type { CheckboxSize };

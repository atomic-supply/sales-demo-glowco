/** @jsxImportSource @emotion/react */
"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const switchRootStyles = css`
  display: inline-flex;
  height: 1.15rem;
  width: 2rem;
  flex-shrink: 0;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid transparent;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 0.2s;
  outline: none;

  &[data-state="checked"] {
    background-color: oklch(0.205 0 0);
  }

  &[data-state="unchecked"] {
    background-color: #d1d5db;
  }

  &:focus-visible {
    border-color: oklch(0.556 0 0);
    box-shadow: 0 0 0 3px oklch(0.556 0 0 / 0.5);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const switchThumbStyles = css`
  background-color: oklch(1 0 0);
  pointer-events: none;
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  box-shadow: 0;
  transition: transform 0.2s;

  &[data-state="checked"] {
    transform: translateX(calc(100% - 2px));
  }

  &[data-state="unchecked"] {
    transform: translateX(0);
  }
`;

function Switch({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & { css?: Interpolation<Theme> }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      css={[switchRootStyles, cssProp]}
      className={className}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" css={switchThumbStyles} />
    </SwitchPrimitive.Root>
  );
}

export { Switch };

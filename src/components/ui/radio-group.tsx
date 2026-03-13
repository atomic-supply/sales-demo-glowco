/** @jsxImportSource @emotion/react */
"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const radioGroupRootStyles = css`
  display: grid;
  gap: 0.75rem;
`;

function RadioGroup({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & { css?: Interpolation<Theme> }) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      css={[radioGroupRootStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const radioGroupItemStyles = css`
  border: 1px solid #d1d5db;
  color: oklch(0.205 0 0);
  aspect-ratio: 1;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition:
    color 0.2s,
    box-shadow 0.2s;
  outline: none;

  &:focus-visible {
    border-color: oklch(0.556 0 0);
    box-shadow: 0 0 0 3px oklch(0.556 0 0 / 0.5);
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

const radioGroupIndicatorStyles = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const circleIconStyles = css`
  fill: oklch(0.205 0 0);
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.5rem;
  height: 0.5rem;
  transform: translate(-50%, -50%);
`;

function RadioGroupItem({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & { css?: Interpolation<Theme> }) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      css={[radioGroupItemStyles, cssProp]}
      className={className}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        css={radioGroupIndicatorStyles}
      >
        <CircleIcon css={circleIconStyles} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };

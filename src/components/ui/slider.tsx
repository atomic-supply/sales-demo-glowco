/** @jsxImportSource @emotion/react */
"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const sliderRootStyles = css`
  position: relative;
  display: flex;
  width: 100%;
  touch-action: none;
  align-items: center;
  user-select: none;

  &[data-disabled] {
    opacity: 0.5;
  }

  &[data-orientation="vertical"] {
    height: 100%;
    min-height: 11rem;
    width: auto;
    flex-direction: column;
  }
`;

const sliderTrackStyles = css`
  background-color: oklch(0.97 0 0);
  position: relative;
  flex-grow: 1;
  overflow: hidden;
  border-radius: 9999px;

  &[data-orientation="horizontal"] {
    height: 0.375rem;
    width: 100%;
  }

  &[data-orientation="vertical"] {
    height: 100%;
    width: 0.375rem;
  }
`;

const sliderRangeStyles = css`
  background-color: oklch(0.205 0 0);
  position: absolute;

  &[data-orientation="horizontal"] {
    height: 100%;
  }

  &[data-orientation="vertical"] {
    width: 100%;
  }
`;

const sliderThumbStyles = css`
  border: 1px solid oklch(0.205 0 0);
  background-color: oklch(1 0 0);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  display: block;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  transition:
    color 0.2s,
    box-shadow 0.2s;

  &:hover {
    box-shadow: 0 0 0 4px oklch(0.556 0 0 / 0.5);
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px oklch(0.556 0 0 / 0.5);
    outline: none;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & { css?: Interpolation<Theme> }) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      css={[sliderRootStyles, cssProp]}
      className={className}
      {...props}
    >
      <SliderPrimitive.Track data-slot="slider-track" css={sliderTrackStyles}>
        <SliderPrimitive.Range data-slot="slider-range" css={sliderRangeStyles} />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb data-slot="slider-thumb" key={index} css={sliderThumbStyles} />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };

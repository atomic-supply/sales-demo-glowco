/** @jsxImportSource @emotion/react */
"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const popoverContentStyles = css`
  z-index: 9999 !important;
  width: 18rem;
  border-radius: 0.375rem;
  border: 1px solid oklch(0.922 0 0);
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  padding: 1rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  outline: none;
  isolation: isolate;

  &[data-state="open"] {
    animation:
      fadeIn 0.15s ease-out,
      zoomIn 0.15s ease-out;
  }

  &[data-state="closed"] {
    animation:
      fadeOut 0.15s ease-in,
      zoomOut 0.15s ease-in;
  }

  &[data-side="bottom"] {
    animation-name: slideInFromTop;
  }

  &[data-side="left"] {
    animation-name: slideInFromRight;
  }

  &[data-side="right"] {
    animation-name: slideInFromLeft;
  }

  &[data-side="top"] {
    animation-name: slideInFromBottom;
  }
`;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { css?: Interpolation<Theme> }
>(({ className, align = "center", sideOffset = 4, css: cssProp, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      css={[popoverContentStyles, cssProp]}
      className={className}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverContent, PopoverTrigger };

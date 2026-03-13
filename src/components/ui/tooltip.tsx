/** @jsxImportSource @emotion/react */
"use client";

import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

const tooltipContentStyles = css`
  background-color: oklch(0.205 0 0);
  color: oklch(0.985 0 0);
  z-index: 50;
  width: fit-content;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  text-wrap: balance;

  &[data-state="open"] {
    animation:
      fadeIn 0.15s ease-out,
      zoomIn 0.15s ease-out;
  }

  &[data-state="closed"] {
    animation:
      fadeOut 0.1s ease-in,
      zoomOut 0.1s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes zoomIn {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes zoomOut {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.95);
    }
  }
`;

const tooltipArrowStyles = css`
  background-color: oklch(0.205 0 0);
  fill: oklch(0.205 0 0);
  z-index: 50;
  width: 0.625rem;
  height: 0.625rem;
  transform: translateY(calc(-50% - 2px)) rotate(45deg);
  border-radius: 2px;
`;

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & { css?: Interpolation<Theme> }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        css={[tooltipContentStyles, cssProp]}
        className={className}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow css={tooltipArrowStyles} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

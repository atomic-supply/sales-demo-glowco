/** @jsxImportSource @emotion/react */
"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

function HoverCard({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
}

const hoverCardContentStyles = css`
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  z-index: 50;
  width: 16rem;
  transform-origin: var(--radix-hover-card-content-transform-origin);
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  outline: none;

  &[data-state="open"] {
    animation:
      fade-in 0.2s,
      zoom-in 0.2s;
  }

  &[data-state="closed"] {
    animation:
      fade-out 0.2s,
      zoom-out 0.2s;
  }

  &[data-side="bottom"] {
    animation-name: slide-in-from-top-2;
  }

  &[data-side="left"] {
    animation-name: slide-in-from-right-2;
  }

  &[data-side="right"] {
    animation-name: slide-in-from-left-2;
  }

  &[data-side="top"] {
    animation-name: slide-in-from-bottom-2;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes zoom-in {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes zoom-out {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.95);
    }
  }

  @keyframes slide-in-from-top-2 {
    from {
      transform: translateY(-0.5rem);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-in-from-right-2 {
    from {
      transform: translateX(0.5rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-from-left-2 {
    from {
      transform: translateX(-0.5rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-from-bottom-2 {
    from {
      transform: translateY(0.5rem);
    }
    to {
      transform: translateY(0);
    }
  }
`;

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & { css?: Interpolation<Theme> }) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        css={[hoverCardContentStyles, cssProp]}
        className={className}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };

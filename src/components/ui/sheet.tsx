/** @jsxImportSource @emotion/react */
"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

const sheetOverlayStyles = css`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.5);

  &[data-state="open"] {
    animation: fade-in 0.2s;
  }

  &[data-state="closed"] {
    animation: fade-out 0.2s;
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
`;

function SheetOverlay({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay> & { css?: Interpolation<Theme> }) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      css={[sheetOverlayStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const baseSheetContentStyles = css`
  background-color: oklch(1 0 0);
  position: fixed;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  transition: ease-in-out;

  &[data-state="open"] {
    animation: slide-in 0.5s;
  }

  &[data-state="closed"] {
    animation: slide-out 0.3s;
  }
`;

const sheetContentRightStyles = css`
  &[data-state="closed"] {
    animation-name: slide-out-to-right;
  }

  &[data-state="open"] {
    animation-name: slide-in-from-right;
  }

  inset: 0;
  top: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 75%;
  border-left: 1px solid #e5e7eb;

  @media (min-width: 640px) {
    max-width: 24rem;
  }

  @keyframes slide-in-from-right {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-out-to-right {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }
`;

const sheetContentLeftStyles = css`
  &[data-state="closed"] {
    animation-name: slide-out-to-left;
  }

  &[data-state="open"] {
    animation-name: slide-in-from-left;
  }

  inset: 0;
  top: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 75%;
  border-right: 1px solid #e5e7eb;

  @media (min-width: 640px) {
    max-width: 24rem;
  }

  @keyframes slide-in-from-left {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-out-to-left {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;

const sheetContentTopStyles = css`
  &[data-state="closed"] {
    animation-name: slide-out-to-top;
  }

  &[data-state="open"] {
    animation-name: slide-in-from-top;
  }

  inset: 0;
  left: 0;
  right: 0;
  top: 0;
  height: auto;
  border-bottom: 1px solid #e5e7eb;

  @keyframes slide-in-from-top {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-out-to-top {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-100%);
    }
  }
`;

const sheetContentBottomStyles = css`
  &[data-state="closed"] {
    animation-name: slide-out-to-bottom;
  }

  &[data-state="open"] {
    animation-name: slide-in-from-bottom;
  }

  inset: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: auto;
  border-top: 1px solid #e5e7eb;

  @keyframes slide-in-from-bottom {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-out-to-bottom {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }
`;

const sheetCloseButtonStyles = css`
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 2px;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &:focus {
    box-shadow:
      0 0 0 2px oklch(0.556 0 0),
      0 0 0 4px oklch(0.556 0 0 / 0.2);
    outline: none;
  }

  &[data-state="open"] {
    background-color: oklch(0.97 0 0);
  }

  &:disabled {
    pointer-events: none;
  }
`;

const srOnlyStyles = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

function SheetContent({
  className,
  children,
  side = "right",
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  css?: Interpolation<Theme>;
}) {
  const sideStyles = {
    right: sheetContentRightStyles,
    left: sheetContentLeftStyles,
    top: sheetContentTopStyles,
    bottom: sheetContentBottomStyles,
  }[side];

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        css={[baseSheetContentStyles, sideStyles, cssProp]}
        className={className}
        {...props}
      >
        {children}
        <SheetPrimitive.Close css={sheetCloseButtonStyles}>
          <XIcon
            css={css`
              width: 1rem;
              height: 1rem;
            `}
          />
          <span css={srOnlyStyles}>Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

const sheetHeaderStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1rem;
`;

function SheetHeader({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="sheet-header"
      css={[sheetHeaderStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const sheetFooterStyles = css`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`;

function SheetFooter({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="sheet-footer"
      css={[sheetFooterStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const sheetTitleStyles = css`
  color: oklch(0.145 0 0);
  font-weight: 600;
`;

function SheetTitle({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title> & { css?: Interpolation<Theme> }) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      css={[sheetTitleStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const sheetDescriptionStyles = css`
  color: oklch(0.556 0 0);
  font-size: 0.875rem;
`;

function SheetDescription({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description> & { css?: Interpolation<Theme> }) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      css={[sheetDescriptionStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};

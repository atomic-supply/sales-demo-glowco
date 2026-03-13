/** @jsxImportSource @emotion/react */
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

const dialogOverlayStyles = css`
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

function DialogOverlay({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay> & { css?: Interpolation<Theme> }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      css={[dialogOverlayStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const dialogContentStyles = css`
  background-color: oklch(1 0 0);
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 50;
  display: grid;
  width: 100%;
  max-width: calc(100% - 2rem);
  transform: translate(-50%, -50%);
  gap: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  transition-duration: 0.2s;

  @media (min-width: 640px) {
    max-width: 32rem;
  }

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

  @keyframes zoom-in {
    from {
      transform: translate(-50%, -50%) scale(0.95);
    }
    to {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @keyframes zoom-out {
    from {
      transform: translate(-50%, -50%) scale(1);
    }
    to {
      transform: translate(-50%, -50%) scale(0.95);
    }
  }
`;

const dialogCloseButtonStyles = css`
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
    color: oklch(0.556 0 0);
  }

  &:disabled {
    pointer-events: none;
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;

    &:not([class*="size-"]) {
      width: 1rem;
      height: 1rem;
    }
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

function DialogContent({
  className,
  children,
  showCloseButton = true,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  css?: Interpolation<Theme>;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        css={[dialogContentStyles, cssProp]}
        className={className}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" css={dialogCloseButtonStyles}>
            <XIcon />
            <span css={srOnlyStyles}>Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

const dialogHeaderStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

function DialogHeader({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="dialog-header"
      css={[dialogHeaderStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const dialogFooterStyles = css`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

function DialogFooter({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="dialog-footer"
      css={[dialogFooterStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const dialogTitleStyles = css`
  font-size: 1.125rem;
  line-height: 1;
  font-weight: 600;
`;

function DialogTitle({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & { css?: Interpolation<Theme> }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      css={[dialogTitleStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const dialogDescriptionStyles = css`
  color: oklch(0.556 0 0);
  font-size: 0.875rem;
`;

function DialogDescription({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description> & { css?: Interpolation<Theme> }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      css={[dialogDescriptionStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

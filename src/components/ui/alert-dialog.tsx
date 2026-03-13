/** @jsxImportSource @emotion/react */
"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import { Button } from "./button";

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

const alertDialogOverlayStyles = css`
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

function AlertDialogOverlay({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay> & { css?: Interpolation<Theme> }) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      css={[alertDialogOverlayStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const alertDialogContentStyles = css`
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

function AlertDialogContent({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & { css?: Interpolation<Theme> }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        css={[alertDialogContentStyles, cssProp]}
        className={className}
        {...props}
      />
    </AlertDialogPortal>
  );
}

const alertDialogHeaderStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

function AlertDialogHeader({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="alert-dialog-header"
      css={[alertDialogHeaderStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const alertDialogFooterStyles = css`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

function AlertDialogFooter({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="alert-dialog-footer"
      css={[alertDialogFooterStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const alertDialogTitleStyles = css`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1;
`;

function AlertDialogTitle({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title> & { css?: Interpolation<Theme> }) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      css={[alertDialogTitleStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const alertDialogDescriptionStyles = css`
  font-size: 0.875rem;
  color: oklch(0.556 0 0);
`;

function AlertDialogDescription({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description> & { css?: Interpolation<Theme> }) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      css={[alertDialogDescriptionStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & { css?: Interpolation<Theme> }) {
  return (
    <AlertDialogPrimitive.Action asChild {...props}>
      <Button css={cssProp} className={className} />
    </AlertDialogPrimitive.Action>
  );
}

function AlertDialogCancel({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & { css?: Interpolation<Theme> }) {
  return (
    <AlertDialogPrimitive.Cancel asChild {...props}>
      <Button variant="outline" css={cssProp} className={className} />
    </AlertDialogPrimitive.Cancel>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};

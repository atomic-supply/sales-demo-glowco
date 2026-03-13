/** @jsxImportSource @emotion/react */
"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const ToastProvider = ToastPrimitives.Provider;

const toastViewportStyles = css`
  position: fixed;
  top: 0;
  z-index: 100;
  display: flex;
  max-height: 100vh;
  width: 100%;
  flex-direction: column-reverse;
  padding: 1rem;

  @media (min-width: 640px) {
    bottom: 0;
    right: 0;
    top: auto;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    max-width: 420px;
  }
`;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> & { css?: Interpolation<Theme> }
>(({ className, css: cssProp, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    css={[toastViewportStyles, cssProp]}
    className={className}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const baseToastStyles = css`
  pointer-events: auto;
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  padding-right: 2rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  transition: all 0.2s;

  &[data-swipe="cancel"] {
    transform: translateX(0);
  }

  &[data-swipe="end"] {
    transform: translateX(var(--radix-toast-swipe-end-x));
  }

  &[data-swipe="move"] {
    transform: translateX(var(--radix-toast-swipe-move-x));
    transition: none;
  }

  &[data-state="open"] {
    animation: slide-in-from-top-full 0.2s;

    @media (min-width: 640px) {
      animation: slide-in-from-bottom-full 0.2s;
    }
  }

  &[data-state="closed"] {
    animation:
      fade-out-80 0.2s,
      slide-out-to-right-full 0.2s;
  }

  &[data-swipe="end"] {
    animation: slide-out-to-right-full 0.2s;
  }

  @keyframes slide-in-from-top-full {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-in-from-bottom-full {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes fade-out-80 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.2;
    }
  }

  @keyframes slide-out-to-right-full {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }
`;

const toastDefaultStyles = css`
  border: 1px solid #e5e7eb;
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
`;

const toastDestructiveStyles = css`
  border: 1px solid #dc2626;
  background-color: #dc2626;
  color: white;
`;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & {
    variant?: "default" | "destructive";
    css?: Interpolation<Theme>;
  }
>(({ className, variant = "default", css: cssProp, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      css={[
        baseToastStyles,
        variant === "default" ? toastDefaultStyles : toastDestructiveStyles,
        cssProp,
      ]}
      className={className}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const toastActionStyles = css`
  display: inline-flex;
  height: 2rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  background-color: transparent;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: oklch(0.97 0 0);
  }

  &:focus {
    outline: none;
    box-shadow:
      0 0 0 2px oklch(0.556 0 0),
      0 0 0 4px oklch(0.556 0 0 / 0.2);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  .destructive & {
    border-color: rgba(107, 114, 128, 0.4);

    &:hover {
      border-color: rgba(220, 38, 38, 0.3);
      background-color: #dc2626;
      color: white;
    }

    &:focus {
      box-shadow:
        0 0 0 2px #dc2626,
        0 0 0 4px rgba(220, 38, 38, 0.2);
    }
  }
`;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & { css?: Interpolation<Theme> }
>(({ className, css: cssProp, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    css={[toastActionStyles, cssProp]}
    className={className}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const toastCloseStyles = css`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  border-radius: 0.375rem;
  padding: 0.25rem;
  color: rgba(17, 24, 39, 0.5);
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    color: oklch(0.145 0 0);
  }

  &:focus {
    opacity: 1;
    outline: none;
    box-shadow: 0 0 0 2px oklch(0.556 0 0);
  }

  .group:hover & {
    opacity: 1;
  }

  .destructive & {
    color: rgba(252, 165, 165, 1);

    &:hover {
      color: rgba(254, 242, 242, 1);
    }

    &:focus {
      box-shadow:
        0 0 0 2px #f87171,
        0 0 0 4px rgba(248, 113, 113, 0.2);
    }
  }
`;

const xIconStyles = css`
  height: 1rem;
  width: 1rem;
`;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> & { css?: Interpolation<Theme> }
>(({ className, css: cssProp, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    css={[toastCloseStyles, cssProp]}
    className={className}
    toast-close=""
    {...props}
  >
    <X css={xIconStyles} />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const toastTitleStyles = css`
  font-size: 0.875rem;
  font-weight: 600;
`;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> & { css?: Interpolation<Theme> }
>(({ className, css: cssProp, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    css={[toastTitleStyles, cssProp]}
    className={className}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const toastDescriptionStyles = css`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> & {
    css?: Interpolation<Theme>;
  }
>(({ className, css: cssProp, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    css={[toastDescriptionStyles, cssProp]}
    className={className}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
};

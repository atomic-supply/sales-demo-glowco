/** @jsxImportSource @emotion/react */
"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import { theme } from "../../styles/theme/theme";

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

const accordionItemStyles = css`
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  overflow: hidden;

  & + & {
    margin-top: 0.5rem;
  }
`;

function AccordionItem({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> & { css?: Interpolation<Theme> }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      css={[accordionItemStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const accordionTriggerStyles = css`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.colors.foreground};
  background: ${theme.colors.gray200};
  border: none;
  cursor: pointer;
  outline: none;
  transition: background 0.15s;
  width: 100%;

  &:hover {
    background: ${theme.colors.gray300};
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${theme.colors.ring} inset;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const chevronClosedStyles = css`
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: ${theme.colors.mutedForeground};
`;

function AccordionTrigger({
  className,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { css?: Interpolation<Theme> }) {
  return (
    <AccordionPrimitive.Header
      css={css`
        display: flex;
        margin: 0;
      `}
    >
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        css={[accordionTriggerStyles, cssProp]}
        className={className}
        {...props}
      >
        <ChevronRight
          css={css`
            ${chevronClosedStyles};
            [data-state="open"] > & {
              display: none;
            }
          `}
        />
        <ChevronDown
          css={css`
            ${chevronClosedStyles};
            display: none;
            [data-state="open"] > & {
              display: block;
            }
          `}
        />
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

const accordionContentStyles = css`
  overflow: hidden;
  font-size: 0.875rem;

  &[data-state="closed"] {
    animation: accordion-up 0.2s ease-out;
  }

  &[data-state="open"] {
    animation: accordion-down 0.2s ease-out;
  }

  @keyframes accordion-down {
    from {
      height: 0;
    }
    to {
      height: var(--radix-accordion-content-height);
    }
  }

  @keyframes accordion-up {
    from {
      height: var(--radix-accordion-content-height);
    }
    to {
      height: 0;
    }
  }
`;

function AccordionContent({
  className,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content> & { css?: Interpolation<Theme> }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      css={[accordionContentStyles, cssProp]}
      {...props}
    >
      <div className={className}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

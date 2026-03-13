/** @jsxImportSource @emotion/react */
"use client";

import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  FormProvider,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "./label";

const Form = FormProvider;

import { FormFieldContext, FormItemContext, useFormField } from "./form-utils";

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const formItemStyles = css`
  display: grid;
  gap: 0.5rem;
`;

function FormItem({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" css={[formItemStyles, cssProp]} className={className} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { css?: Interpolation<Theme> }) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      css={[
        css`
          &[data-error="true"] {
            color: #dc2626;
          }
        `,
        cssProp,
      ]}
      className={className}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

const formDescriptionStyles = css`
  color: oklch(0.556 0 0);
  font-size: 0.875rem;
`;

function FormDescription({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"p"> & { css?: Interpolation<Theme> }) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      css={[formDescriptionStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const formMessageStyles = css`
  color: #dc2626;
  font-size: 0.875rem;
`;

function FormMessage({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"p"> & { css?: Interpolation<Theme> }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      css={[formMessageStyles, cssProp]}
      className={className}
      {...props}
    >
      {body}
    </p>
  );
}

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage };

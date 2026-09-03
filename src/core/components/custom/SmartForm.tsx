"use client";

import { createContext, useContext, useEffect, useId } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { digitsArToEn, digitsFaToEn } from "@persian-tools/persian-tools";
import {
  format as formatWithJalali,
  isValid as isValidDate,
  parse as parseWithJalali,
} from "date-fns-jalali";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
  useWatch,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type DefaultValues,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  type Resolver,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
  type UseFormSetError,
} from "react-hook-form";
import { z } from "zod";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/core/components/ui/field";
import { cn } from "@/core/utils/helpers";

import { Button } from "../ui/button";

/* -------------------------------------------------------------------------- */
/*                                   types                                    */
/* -------------------------------------------------------------------------- */

// (۱) Zod 4: امضای ZodType به <Output, Input> تغییر کرده و ZodTypeDef حذف شده.
// پارامتر سوم در Zod 4 «Internals» است، نه Input.
type FormSchema = z.ZodType<FieldValues, FieldValues>;

// (۲) به‌جای conditional type که union می‌سازد و TS نمی‌تواند ارضای
// constraint را اثبات کند، از intersection استفاده می‌کنیم.
type SchemaInput<TSchema extends FormSchema> = z.input<TSchema> & FieldValues;

type SchemaOutput<TSchema extends FormSchema> = z.output<TSchema> & FieldValues;

type FormApi<TSchema extends FormSchema> = UseFormReturn<
  SchemaInput<TSchema>,
  unknown,
  SchemaOutput<TSchema>
>;

type FieldMessage = { message?: string };

/* -------------------------------------------------------------------------- */
/*                              error collection                              */
/* -------------------------------------------------------------------------- */

// "types" همچنان در این مجموعه است تا حلقه‌ی عمومی آن را دوباره پیمایش نکند،
// اما (۳) جداگانه و صریح پیمایشش می‌کنیم.
const IGNORED_ERROR_KEYS = new Set(["ref", "message", "type", "types"]);

function collectFieldMessages(
  error: unknown,
  messages: FieldMessage[] = [],
): FieldMessage[] {
  if (!error || typeof error !== "object") {
    return messages;
  }

  if (Array.isArray(error)) {
    for (const item of error) {
      collectFieldMessages(item, messages);
    }

    return messages;
  }

  const node = error as Record<string, unknown>;

  if (typeof node.message === "string" && node.message.length > 0) {
    messages.push({ message: node.message });
  }

  // (۳) پیام‌های چندگانه‌ی validate: { types: { required, custom } }
  if (
    node.types &&
    typeof node.types === "object" &&
    !Array.isArray(node.types)
  ) {
    for (const value of Object.values(node.types)) {
      if (typeof value === "string" && value.length > 0) {
        messages.push({ message: value });
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === "string" && item.length > 0) {
            messages.push({ message: item });
          }
        }
      }
    }
  }

  for (const [key, value] of Object.entries(node)) {
    if (IGNORED_ERROR_KEYS.has(key)) {
      continue;
    }

    collectFieldMessages(value, messages);
  }

  return messages;
}

/* -------------------------------------------------------------------------- */
/*                        i18n: پیام‌های پیش‌فرض Zod                          */
/* -------------------------------------------------------------------------- */

let localeInstalled = false;

function installPersianFormLocale() {
  if (localeInstalled) {
    return;
  }

  localeInstalled = true;

  const runtime = z as unknown as {
    config?: (config: unknown) => void;
    locales?: { fa?: () => unknown };
  };

  if (typeof runtime.config === "function" && runtime.locales?.fa) {
    runtime.config(runtime.locales.fa());
  }
}

installPersianFormLocale();

/* -------------------------------------------------------------------------- */
/*                      normalization: ارقام فارسی/عربی                       */
/* -------------------------------------------------------------------------- */

type FieldNormalizer = (value: string) => string;

const normalizeNumerals: FieldNormalizer = (value) =>
  digitsArToEn(digitsFaToEn(value));

function readTextChangeValue(event: unknown): string | null {
  if (typeof event === "string") {
    return event;
  }

  if (!event || typeof event !== "object" || !("target" in event)) {
    return null;
  }

  const target = (event as { target: unknown }).target as
    (HTMLInputElement & { type?: string }) | null;

  if (!target || typeof target.value !== "string") {
    return null;
  }

  if (
    target.type === "checkbox" ||
    target.type === "radio" ||
    target.type === "file"
  ) {
    return null;
  }

  return target.value;
}

function createNormalizedChangeHandler(
  onChange: (...event: unknown[]) => void,
  normalize: FieldNormalizer | false,
) {
  if (!normalize) {
    return onChange;
  }

  return (event: unknown) => {
    const raw = readTextChangeValue(event);

    if (raw === null) {
      return onChange(event);
    }

    const next = normalize(raw);

    return next === raw ? onChange(event) : onChange(next);
  };
}

/* -------------------------------------------------------------------------- */
/*                            تاریخ جلالی در اسکیما                           */
/* -------------------------------------------------------------------------- */

const JALALI_DATE_PATTERN = "yyyy/MM/dd";

function formatJalaliDate(
  date: Date | null | undefined,
  pattern: string = JALALI_DATE_PATTERN,
) {
  if (!date || !isValidDate(date)) {
    return "";
  }

  return formatWithJalali(date, pattern);
}

function parseJalaliDate(
  value: string,
  pattern: string = JALALI_DATE_PATTERN,
): Date | null {
  const parsed = parseWithJalali(
    normalizeNumerals(value.trim()),
    pattern,
    new Date(),
  );

  return isValidDate(parsed) ? parsed : null;
}

function jalaliDate(options?: { pattern?: string; message?: string }) {
  const {
    pattern = JALALI_DATE_PATTERN,
    message = "تاریخ را به شکل ۱۴۰۴/۰۵/۲۵ وارد کنید",
  } = options ?? {};

  return z
    .string()
    .transform((value) => parseJalaliDate(value, pattern))
    .refine((date): date is Date => date !== null, { message });
}

/* -------------------------------------------------------------------------- */
/*                              خطاهای سمت سرور                               */
/* -------------------------------------------------------------------------- */

type ServerErrorPayload<TFieldValues extends FieldValues> = {
  message?: string;
  fields?: Partial<Record<FieldPath<TFieldValues>, string | string[]>>;
};

function applyServerErrors<TFieldValues extends FieldValues>(
  form: { setError: UseFormSetError<TFieldValues> },
  payload: ServerErrorPayload<TFieldValues>,
) {
  if (payload.message) {
    form.setError("root", { type: "server", message: payload.message });
  }

  // (۳) Object.entries روی Partial<Record<FieldPath, ...>> مقدار را طوری
  // پهن می‌کند که narrowing با Array.isArray به {} می‌رسد؛ پس منبع را
  // پیش از پیمایش به یک Record ساده cast می‌کنیم.
  const fields = (payload.fields ?? {}) as Record<
    string,
    string | string[] | undefined
  >;

  for (const [name, message] of Object.entries(fields)) {
    const text: string | undefined = Array.isArray(message)
      ? message.join(" ")
      : message;

    if (!text) {
      continue;
    }

    form.setError(name as FieldPath<TFieldValues>, {
      type: "server",
      message: text,
    });
  }
}

function FormError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { errors } = useFormState();
  const message = (errors.root as FieldMessage | undefined)?.message;
  const content = children ?? message;

  if (!content) {
    return null;
  }

  return (
    <p
      role="alert"
      data-slot="form-error"
      className={cn("text-destructive text-sm font-medium", className)}
      {...props}
    >
      {content}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Form                                    */
/* -------------------------------------------------------------------------- */

function UnsavedChangesPrompt({
  active,
  message,
}: {
  active: boolean;
  message: string;
}) {
  useEffect(() => {
    if (!active) {
      return;
    }

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;

      return message;
    };

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
  }, [active, message]);

  return null;
}

type FormSharedProps<TSchema extends FormSchema = FormSchema> = Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "children"
> & {
  onSubmit: SubmitHandler<SchemaOutput<TSchema>>;
  onInvalid?: SubmitErrorHandler<SchemaInput<TSchema>>;
  disableWhileSubmitting?: boolean;
  warnOnUnsavedChanges?: boolean | string;
  children: React.ReactNode | ((form: FormApi<TSchema>) => React.ReactNode);
};

type FormProps<TSchema extends FormSchema = FormSchema> =
  FormSharedProps<TSchema> & {
    schema?: TSchema;
    defaultValues?: DefaultValues<SchemaInput<TSchema>>;
    form?: FormApi<TSchema>;
    formOptions?: Omit<
      UseFormProps<SchemaInput<TSchema>, unknown, SchemaOutput<TSchema>>,
      "resolver" | "defaultValues"
    >;
  };

// (۲) کامپوننت مشترک؛ فرم را آماده دریافت می‌کند و useForm صدا نمی‌زند.
function FormContainer<TSchema extends FormSchema>({
  form,
  onSubmit,
  onInvalid,
  disableWhileSubmitting = true,
  warnOnUnsavedChanges = false,
  className,
  children,
  ...props
}: FormSharedProps<TSchema> & { form: FormApi<TSchema> }) {
  const { isSubmitting, isDirty } = form.formState;
  const content = typeof children === "function" ? children(form) : children;

  return (
    <FormProvider {...form}>
      <form
        noValidate
        data-slot="form"
        data-submitting={isSubmitting || null}
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className={cn("w-full", className)}
        {...props}
      >
        <fieldset
          disabled={disableWhileSubmitting && isSubmitting}
          className="contents"
        >
          {content}
        </fieldset>

        {warnOnUnsavedChanges ? (
          <UnsavedChangesPrompt
            active={isDirty && !isSubmitting}
            message={
              typeof warnOnUnsavedChanges === "string"
                ? warnOnUnsavedChanges
                : "تغییرات ذخیره‌نشده دارید. از این صفحه خارج می‌شوید؟"
            }
          />
        ) : null}
      </form>
    </FormProvider>
  );
}
const noOpSchema = z.object({}).loose() as FormSchema;
// (۲) فقط این مسیر useForm/resolver/defaultValues می‌سازد.
function FormInner<TSchema extends FormSchema>({
  schema,
  defaultValues,
  formOptions,
  ...shared
}: Omit<FormProps<TSchema>, "form">) {
  const resolvedSchema = (schema ?? noOpSchema) as TSchema;
  const resolvedDefaultValues = (defaultValues ?? {}) as DefaultValues<
    SchemaInput<TSchema>
  >;

  const form = useForm<SchemaInput<TSchema>, unknown, SchemaOutput<TSchema>>({
    ...formOptions,
    defaultValues: resolvedDefaultValues,
    resolver: zodResolver(resolvedSchema) as unknown as Resolver<
      SchemaInput<TSchema>,
      unknown,
      SchemaOutput<TSchema>
    >,
  });

  return <FormContainer<TSchema> form={form} {...shared} />;
}

// (۲) اگر form بیرونی داده شد، هیچ useForm داخلی‌ای اجرا نمی‌شود.
function Form<TSchema extends FormSchema>({
  form,
  schema,
  defaultValues,
  formOptions,
  ...shared
}: FormProps<TSchema>) {
  if (form) {
    return <FormContainer<TSchema> form={form} {...shared} />;
  }

  return (
    <FormInner<TSchema>
      schema={schema}
      defaultValues={defaultValues}
      formOptions={formOptions}
      {...shared}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                               field context                                */
/* -------------------------------------------------------------------------- */

type FormFieldContextValue = {
  name: string;
  controlId: string;
  descriptionId: string;
  errorId: string;
  describedBy: string | undefined;
  invalid: boolean;
  errors: FieldMessage[];
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

function useFormField() {
  const context = useContext(FormFieldContext);

  if (!context) {
    throw new Error("useFormField must be used inside <FormField>.");
  }

  return context;
}

/* -------------------------------------------------------------------------- */
/*                                 FormField                                  */
/* -------------------------------------------------------------------------- */

type FormFieldControlProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = ControllerRenderProps<TFieldValues, TName> & {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
};

type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<React.ComponentProps<typeof Field>, "children"> & {
  name: TName;
  control?: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  normalize?: FieldNormalizer | false;
  children: (props: {
    field: FormFieldControlProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
  }) => React.ReactNode;
};

function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  normalize = normalizeNumerals,
  orientation = "vertical",
  className,
  children,
  ...props
}: FormFieldProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const resolvedControl = control ?? formContext?.control;
  const id = useId();

  if (!resolvedControl) {
    throw new Error(
      "<FormField> needs a `control` prop or to be rendered inside <Form>.",
    );
  }

  const controlId = `${id}-control`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <Controller
      name={name}
      control={resolvedControl}
      render={({ field, fieldState }) => {
        const errors = collectFieldMessages(fieldState.error);
        const describedBy =
          [description ? descriptionId : null, errors.length ? errorId : null]
            .filter(Boolean)
            .join(" ") || undefined;

        const contextValue: FormFieldContextValue = {
          name,
          controlId,
          descriptionId,
          errorId,
          describedBy,
          invalid: fieldState.invalid,
          errors,
        };

        // نام قبلی `control` بود و prop بیرونی را shadow می‌کرد.
        const controlNode = children({
          field: {
            ...field,
            onChange: createNormalizedChangeHandler(field.onChange, normalize),
            id: controlId,
            "aria-invalid": fieldState.invalid,
            "aria-describedby": describedBy,
          },
          fieldState,
        });

        const labelNode = label ? (
          <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
        ) : null;

        const descriptionNode = description ? (
          <FieldDescription id={descriptionId}>{description}</FieldDescription>
        ) : null;

        return (
          <FormFieldContext.Provider value={contextValue}>
            <Field
              orientation={orientation}
              data-invalid={fieldState.invalid || null}
              data-disabled={field.disabled || null}
              className={className}
              {...props}
            >
              {orientation === "vertical" ? (
                <>
                  {labelNode}
                  {controlNode}
                  {descriptionNode}
                  <FormFieldError />
                </>
              ) : (
                <>
                  {controlNode}
                  <FieldContent>
                    {labelNode}
                    {descriptionNode}
                    <FormFieldError />
                  </FieldContent>
                </>
              )}
            </Field>
          </FormFieldContext.Provider>
        );
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                               FormFieldError                               */
/* -------------------------------------------------------------------------- */

// (۴) base-ui برای errors تایپ ({ message?: string } | undefined)[] | undefined
// دارد و null نمی‌پذیرد. پس در حالت children سراسر prop را پاس نمی‌دهیم.
function FormFieldError({
  children,
  ...props
}: Omit<React.ComponentProps<typeof FieldError>, "errors">) {
  const { errorId, errors } = useFormField();

  if (children) {
    return (
      <FieldError id={errorId} {...props}>
        {children}
      </FieldError>
    );
  }

  return <FieldError id={errorId} errors={errors} {...props} />;
}

/* -------------------------------------------------------------------------- */
/*                                FormFieldSet                                */
/* -------------------------------------------------------------------------- */

function FormFieldSet({
  legend,
  description,
  className,
  children,
  ...props
}: React.ComponentProps<"fieldset"> & {
  legend?: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <fieldset
      data-slot="form-fieldset"
      className={cn("flex w-full min-w-0 flex-col gap-4", className)}
      {...props}
    >
      {legend ? (
        <legend className="text-sm leading-snug font-medium">{legend}</legend>
      ) : null}

      {description ? <FieldDescription>{description}</FieldDescription> : null}

      {children}
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 FormWatch                                  */
/* -------------------------------------------------------------------------- */

// (۶) نوع value شامل undefined است و fallback از طریق defaultValue ممکن است.
function FormWatch<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  defaultValue,
  children,
}: {
  name: TName;
  control?: Control<TFieldValues>;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
  children: (
    value: FieldPathValue<TFieldValues, TName> | undefined,
  ) => React.ReactNode;
}) {
  const formContext = useFormContext<TFieldValues>();
  const resolvedControl = control ?? formContext?.control;

  if (!resolvedControl) {
    throw new Error(
      "<FormWatch> needs a `control` prop or to be rendered inside <Form>.",
    );
  }

  const value = useWatch<TFieldValues, TName>({
    control: resolvedControl,
    name,
    defaultValue,
  });

  return <>{children(value)}</>;
}

/* -------------------------------------------------------------------------- */
/*                                 FormSubmit                                 */
/* -------------------------------------------------------------------------- */

type FormSubmitState = {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
};

function FormSubmit({
  disabled,
  requireDirty = false,
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  asChild?: boolean;
  requireDirty?: boolean;
  children: React.ReactNode | ((state: FormSubmitState) => React.ReactNode);
}) {
  const { isSubmitting, isDirty, isValid } = useFormState();
  const state: FormSubmitState = { isSubmitting, isDirty, isValid };

  const isDisabled =
    disabled || isSubmitting || (requireDirty && !isDirty) || false;

  const content = typeof children === "function" ? children(state) : children;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      data-slot="form-submit"
      data-submitting={isSubmitting || null}
      className={className}
      {...props}
    >
      {content}
    </Button>
  );
}

export {
  Form,
  FormError,
  FormField,
  FormFieldError,
  FormFieldSet,
  FormSubmit,
  FormWatch,
  applyServerErrors,
  formatJalaliDate,
  installPersianFormLocale,
  jalaliDate,
  normalizeNumerals,
  parseJalaliDate,
  useFormField,
};
export type {
  FieldNormalizer,
  FormApi,
  FormFieldControlProps,
  ServerErrorPayload,
};

export { FieldGroup } from "@/core/components/ui/field";

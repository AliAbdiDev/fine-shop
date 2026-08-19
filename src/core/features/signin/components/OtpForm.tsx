"use client";

import { useRef } from "react";

import { useSearchParams } from "next/navigation";

import { z } from "zod";

import { PendingSubmitButton } from "@/core/components/custom/PendingSubmitButton";
import {
  Form,
  FormError,
  FormField,
  FieldGroup,
  applyServerErrors,
  type FormApi,
} from "@/core/components/custom/SmartForm";
import { InputOTP, REGEXP_ANY_DIGITS } from "@/core/components/ui/input-otp";

import { sendLoginOtp } from "../actions";

const otpSchema = z.object({
  otp: z.string().length(6, "کد باید ۶ رقم باشد."),
});

export function OtpForm() {
  const searchParams = useSearchParams();
  const formRef = useRef<FormApi<typeof otpSchema> | null>(null);

  return (
    <Form
      schema={otpSchema}
      defaultValues={{ otp: "" }}
      onSubmit={async (values) => {
        // await ضروری است تا isSubmitting تا پایان اکشن true بماند.
        const result = await sendLoginOtp({
          otp: values.otp,
          email: searchParams.get("email") ?? "",
        });

        // موفق => redirect شده و چیزی برنمی‌گردد. اینجا فقط خطاست.
        if (result && formRef.current) {
          applyServerErrors(formRef.current, result);
        }
      }}
      className="w-full max-w-sm"
    >
      {(form) => {
        formRef.current = form;

        return (
          <FieldGroup>
            <FormField name="otp" normalize={false}>
              {({ field }) => (
                <InputOTP
                  autoFocus
                  length={6}
                  pattern={REGEXP_ANY_DIGITS}
                  inputMode="numeric"
                  {...field}
                />
              )}
            </FormField>

            <FormError />
            <PendingSubmitButton>تأیید کد</PendingSubmitButton>
          </FieldGroup>
        );
      }}
    </Form>
  );
}

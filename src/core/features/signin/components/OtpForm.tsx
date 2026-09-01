"use client";

import { useSearchParams } from "next/navigation";

import { z } from "zod";

import { notify } from "@/core/components/custom/notify";
import { PendingSubmitButton } from "@/core/components/custom/PendingSubmitButton";
import {
  Form,
  FormError,
  FormField,
  FieldGroup,
} from "@/core/components/custom/SmartForm";
import { InputOTP, REGEXP_ANY_DIGITS } from "@/core/components/ui/input-otp";
import { sendLoginOtp } from "@/core/services/actions/auth";

const otpSchema = z.object({
  otp: z.string().length(6, "کد باید ۶ رقم باشد."),
});

export function OtpForm() {
  const searchParams = useSearchParams();

  return (
    <Form
      schema={otpSchema}
      defaultValues={{ otp: "" }}
      onSubmit={async (values) => {
        const result = await sendLoginOtp({
          otp: values.otp,
          email: searchParams.get("email") ?? "",
        });

        if (result && !result.ok) {
          notify.error(result.error);
        }
      }}
      className="w-full max-w-sm"
    >
      {() => {
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

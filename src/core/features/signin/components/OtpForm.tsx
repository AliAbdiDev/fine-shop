"use client";

import { useSearchParams } from "next/navigation";

import { PendingSubmitButton } from "@/core/components/custom/PendingSubmitButton";
import {
  Form,
  FormField,
  FieldGroup,
} from "@/core/components/custom/SmartForm";
import { InputOTP, REGEXP_ANY_DIGITS } from "@/core/components/ui/input-otp";

import { sendLoginOtp } from "../actions";

export function OtpForm() {
  const searchParams = useSearchParams();

  return (
    <Form
      defaultValues={{ otp: "" }}
      onSubmit={async (values) => {
        sendLoginOtp({
          otp: values.otp,
          email: searchParams.get("email") || "",
        });
      }}
      className="w-full max-w-sm"
    >
      <FieldGroup>
        <FormField name="otp">
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

        <PendingSubmitButton>تأیید کد</PendingSubmitButton>
      </FieldGroup>
    </Form>
  );
}

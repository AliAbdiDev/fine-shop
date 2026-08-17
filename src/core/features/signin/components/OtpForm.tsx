"use client";

import {
  Form,
  FormField,
  FormSubmit,
  FieldGroup,
} from "@/core/components/custom/SmartForm";
import { InputOTP, REGEXP_ANY_DIGITS } from "@/core/components/ui/input-otp";
export function OtpForm() {
  return (
    <Form
      defaultValues={{ otp: "" }}
      onSubmit={(values) => {
        console.log("OTP:", values.otp);
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

        <FormSubmit>تأیید کد</FormSubmit>
      </FieldGroup>
    </Form>
  );
}

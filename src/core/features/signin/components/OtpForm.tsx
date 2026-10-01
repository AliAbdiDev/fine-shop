"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";

import { z } from "zod";

import { notify } from "@/core/components/custom/notify";
import { PendingSubmitButton } from "@/core/components/custom/PendingSubmitButton";
import {
  Form,
  FormError,
  FormField,
  FieldGroup,
  useFormApi,
} from "@/core/components/custom/SmartForm";
import { InputOTP, REGEXP_ANY_DIGITS } from "@/core/components/ui/input-otp";
import { sendLoginOtp } from "@/core/services/actions/auth";

const otpSchema = z.object({
  otp: z.string().length(6, "کد باید ۶ رقم باشد."),
});

type OtpType = typeof otpSchema;

export function OtpForm() {
  const searchParams = useSearchParams();

  const submit = useCallback(
    async (values: z.infer<OtpType>) => {
      const result = await sendLoginOtp({
        otp: values.otp,
        email: searchParams.get("email") ?? "",
      });

      if (result && !result.ok) {
        notify.error(result.error);
      }
    },
    [searchParams],
  );

  return (
    <Form
      schema={otpSchema}
      defaultValues={{ otp: "" }}
      onSubmit={submit}
      className="w-full max-w-sm"
    >
      <Fields submit={submit} />
    </Form>
  );
}

const Fields = ({
  submit,
}: {
  submit: (values: { otp: string }) => Promise<void>;
}) => {
  const form = useFormApi<OtpType>();
  const [isLoading, setIsLoading] = useState(false);

  const otpVal = form.watch("otp");
  const lastSubmittedOtp = useRef<string | null>(null);

  useEffect(() => {
    if (otpVal.length !== 6) {
      lastSubmittedOtp.current = null;
      return;
    }

    if (lastSubmittedOtp.current === otpVal) return;

    lastSubmittedOtp.current = otpVal;
    setIsLoading(true);

    submit({ otp: otpVal }).finally(() => {
      setIsLoading(false);
    });
  }, [otpVal, submit]);

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
            value={typeof field.value === "string" ? field.value : ""}
          />
        )}
      </FormField>
      <FormError />
      <PendingSubmitButton loading={isLoading}>تأیید کد</PendingSubmitButton>
    </FieldGroup>
  );
};

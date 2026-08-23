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
import { Input } from "@/core/components/ui/input";
import { emailShema } from "@/core/validation-shema";

import { sendLoginEmail } from "../actions";

const signinSchema = z.object({ email: emailShema });

export function SigninForm() {
  const formRef = useRef<FormApi<typeof signinSchema> | null>(null);
  const searchParams = useSearchParams();

  const from = searchParams.get("from");

  return (
    <Form
      schema={signinSchema}
      defaultValues={{ email: "" }}
      onSubmit={async (values) => {
        const result = await sendLoginEmail({
          email: values.email,
        });
        if (result && formRef.current) {
          applyServerErrors(formRef.current, result);
        }
      }}
    >
      {(form) => {
        formRef.current = form;

        return (
          <FieldGroup>
            <FormField<z.infer<typeof signinSchema>, "email">
              name="email"
              label="ایمیل"
              normalize={false}
            >
              {({ field }) => (
                <Input
                  autoFocus
                  {...field}
                  type="text"
                  placeholder="name@example.com"
                />
              )}
            </FormField>

            <FormError />
            <PendingSubmitButton>ارسال ایمیل</PendingSubmitButton>
          </FieldGroup>
        );
      }}
    </Form>
  );
}

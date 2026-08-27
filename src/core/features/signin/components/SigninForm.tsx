"use client";

import { useRef } from "react";

import { z } from "zod";

import { notify } from "@/core/components/custom/notify";
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
import { sendLoginEmail } from "@/core/services/actions/auth";
// اضافه شد
import { emailShema } from "@/core/validation-shema";

const signinSchema = z.object({ email: emailShema });

export function SigninForm() {
  const formRef = useRef<FormApi<typeof signinSchema> | null>(null);

  return (
    <Form
      schema={signinSchema}
      defaultValues={{ email: "" }}
      onSubmit={async (values) => {
        const result = await sendLoginEmail({ email: values.email });

        if (result && !result.ok) {
          notify.error(result.error);

          if (formRef.current) {
            applyServerErrors(formRef.current, {
              message: "ایمیل پذیرفته نشد",
            });
          }
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
                  type="text"
                  placeholder="name@example.com"
                  {...field}
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

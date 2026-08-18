"use client";

import { z } from "zod";

import { PendingSubmitButton } from "@/core/components/custom/PendingSubmitButton";
import {
  Form,
  FormField,
  FieldGroup,
} from "@/core/components/custom/SmartForm";
import { Input } from "@/core/components/ui/input";
import { emailShema } from "@/core/validation-shema";

import { sendLoginEmail } from "../actions";

const signinSchema = z.object({
  email: emailShema,
});

type SigninFormValues = z.infer<typeof signinSchema>;

export function SigninForm() {
  async function onSubmit(values: SigninFormValues) {
    await sendLoginEmail({ email: values.email });
  }

  return (
    <Form
      schema={signinSchema}
      defaultValues={{ email: "" }}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <FormField<SigninFormValues, "email">
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
        <PendingSubmitButton>ارسال ایمیل</PendingSubmitButton>
      </FieldGroup>
    </Form>
  );
}

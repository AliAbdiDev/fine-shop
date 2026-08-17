"use client";

import { useRouter } from "next/navigation";

import { z } from "zod";

import {
  Form,
  FormField,
  FormSubmit,
  FieldGroup,
} from "@/core/components/custom/SmartForm";
import { Input } from "@/core/components/ui/input";
import { emailShema } from "@/core/validation-shema";

const signinSchema = z.object({
  email: emailShema,
});

type SigninFormValues = z.infer<typeof signinSchema>;

export function SigninForm() {
  const { push } = useRouter();
  function onSubmit(values: SigninFormValues) {
    console.log("Email:", values.email);
    push(`/signin/verify?email=${values.email}`);
  }

  return (
    <Form
      schema={signinSchema}
      defaultValues={{ email: "" }}
      onSubmit={onSubmit}
      className=""
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

        <FormSubmit>ارسال ایمیل</FormSubmit>
      </FieldGroup>
    </Form>
  );
}

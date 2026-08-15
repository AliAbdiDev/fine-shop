"use client";

import { useMutation } from "@tanstack/react-query";

import { PendingSubmitButton } from "@/core/components/custom/PendingSubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/core/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/core/components/ui/field";
import { Input } from "@/core/components/ui/input";
import { api, type ApiErrorResponse } from "@/core/services/configs/fetcher";

export interface SendEmailResponse {
  message: string;
}

export function useSendEmail() {
  return useMutation<SendEmailResponse, ApiErrorResponse, string>({
    mutationFn: async (email) => {
      const r = await api.post<SendEmailResponse>("/account/login/", {
        email,
      });
      console.log("🚀 ~ useSendEmail ~ result:", r);

      // NOTE: لایه‌ی api هرگز throw نمی‌کند و همیشه ApiResult برمی‌گرداند.
      // TanStack برای تشخیص خطا به throw نیاز دارد، پس اینجا صریحاً پرتاب می‌کنیم.
      if (!r.ok) {
        throw r.data ?? { message: r.error.message };
      }

      return r.data;
    },
  });
}

export function SigninForm() {
  const sendEmail = useSendEmail();
  return (
    <Card>
      <CardHeader>
        <h1 className="text-lg">ورود یا ثبت نام</h1>
        <CardDescription>
          ایمیل خود را برای ورود یا ثبت نام وارد کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = new FormData(e.currentTarget).get("email") as string;
            sendEmail.mutate(email);
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">ایمیل</FieldLabel>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="name@example.com"
              />
            </Field>

            <PendingSubmitButton>ارسال ایمیل</PendingSubmitButton>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

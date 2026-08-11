import { PendingSubmitButton } from "@/core/components/custom/PendingSubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/core/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/core/components/ui/field";
import { Input } from "@/core/components/ui/input";

import { sendEmail } from "../actions";

export function SigninForm() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-lg">ورود یا ثبت نام</h1>
        <CardDescription>
          ایمیل خود را برای ورود یا ثبت نام وارد کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={sendEmail}>
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

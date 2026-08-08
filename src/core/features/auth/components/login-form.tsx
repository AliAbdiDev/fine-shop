import Link from "next/link";

import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/core/components/ui/field";
import { Input } from "@/core/components/ui/input";
import { cn } from "@/core/utils/helpers";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>ورود به حساب کاربری</CardTitle>
          <CardDescription>
            ایمیل و رمز عبور خود را برای ورود وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">ایمیل</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">رمز عبور</FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    فراموشی رمز عبور
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">ورود</Button>
                <FieldDescription className="text-center">
                  حساب کاربری ندارید؟ <a href="#">ثبت‌نام</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

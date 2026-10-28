import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/core/components/ui/card";
import { SigninForm } from "@/core/features/signin/components/SigninForm";

export default function SigninPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-lg">ورود یا ثبت نام</h1>
        <CardDescription>
          ایمیل خود را برای ورود یا ثبت نام وارد کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SigninForm />{" "}
      </CardContent>
    </Card>
  );
}

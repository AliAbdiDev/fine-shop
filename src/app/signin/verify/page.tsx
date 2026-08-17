import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/core/components/ui/card";
import { OtpForm } from "@/core/features/signin/components/OtpForm";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const param = await searchParams;

  return (
    <Card>
      <CardHeader>
        <h1 className="text-lg">کد تأیید را وارد کنید</h1>
        <CardDescription className="text-wrap">
          کد تأیید به ایمیل شما ارسال شد لطفاً آن را وارد کنید{" "}
          <strong className="block">{param.email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OtpForm />
      </CardContent>
    </Card>
  );
}

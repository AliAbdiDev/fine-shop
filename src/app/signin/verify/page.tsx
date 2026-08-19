import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/core/components/ui/button";
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
        <div className="w-ull flex items-center justify-between">
          <h1 className="text-lg">کد تأیید را وارد کنید</h1>
          <Link href={"/signin"}>
            <Button size={"icon"} variant={"outline"}>
              <ArrowLeft />
            </Button>
          </Link>
        </div>
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

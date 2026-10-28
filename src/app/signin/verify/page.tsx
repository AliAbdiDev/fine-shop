import { Suspense } from "react";

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

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <h1 className="text-lg">کد تأیید را وارد کنید</h1>
          <Link href="/signin">
            <Button size="icon" variant="outline">
              <ArrowLeft />
            </Button>
          </Link>
        </div>

        <Suspense fallback={<VerifyHeaderSkeleton />}>
          <VerifyHeader searchParams={searchParams} />
        </Suspense>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<OtpSkeleton />}>
          <VerifyForm searchParams={searchParams} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function VerifyHeader({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return (
    <CardDescription className="text-wrap">
      کد تأیید به ایمیل شما ارسال شد لطفاً آن را وارد کنید{" "}
      <strong className="block">{email}</strong>
    </CardDescription>
  );
}

async function VerifyForm({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <OtpForm email={email ?? ""} />;
}

function VerifyHeaderSkeleton() {
  return (
    <CardDescription className="text-wrap">
      کد تأیید به ایمیل شما ارسال شد لطفاً آن را وارد کنید…
    </CardDescription>
  );
}

function OtpSkeleton() {
  return (
    <div className="bg-muted h-40 w-full max-w-sm animate-pulse rounded-md" />
  );
}

import { SigninForm } from "@/core/features/signin/components/SigninForm";

export default function SigninPage() {
  return (
    <div className="bg-background flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SigninForm />
      </div>
    </div>
  );
}

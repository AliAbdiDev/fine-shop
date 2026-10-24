export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-dvh w-full items-center justify-center p-6 md:p-10">
      <div className="mx-auto w-full max-w-sm">{children}</div>
    </div>
  );
}

import type { Metadata } from "next";

import { FloatingFooter } from "@/core/features/shop/components/floating-footer";
import { FloatingHeader } from "@/core/features/shop/components/floating-header";

export const metadata: Metadata = {
  title: "فروشگاه من",
  description: "خرید آنلاین با بهترین قیمت و ارسال سریع",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FloatingHeader />
      <main className="mx-auto w-full max-w-6xl px-3 pt-20 pb-20 sm:px-4 sm:pt-24 sm:pb-24">
        {children}
      </main>
      <FloatingFooter />
    </>
  );
}

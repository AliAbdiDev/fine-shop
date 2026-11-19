import type { Metadata } from "next";

import { SiteHeader } from "@/core/features/shop/components/shared/layout/header/site-header";
import { SiteFooter } from "@/core/features/shop/components/shared/layout/site-footer";

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
      <SiteHeader />
      <main className="mx-auto w-full py-8">{children}</main>
      <SiteFooter />
    </>
  );
}

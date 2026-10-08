import type { Metadata } from "next";

import { SiteFooter } from "@/core/features/shop/components/site-footer";
import { SiteHeader } from "@/core/features/shop/components/site-header";

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

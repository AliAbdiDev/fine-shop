import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRight, CheckCircle2, FileText } from "lucide-react";

import { Badge } from "@/core/components/ui/badge";
import { buttonVariants } from "@/core/components/ui/button";
import {
  findOrderByIdOrNumber,
  type OrderRecord,
  SAMPLE_ORDERS,
} from "@/core/features/shop/components/profile/orders-data";
import { cn, toPersianNum } from "@/core/utils/helpers";

import { PrintInvoiceButton } from "./PrintInvoiceButton";

export const metadata: Metadata = {
  title: "فاکتور رسمی فروش | فروشگاه من",
  description: "مشاهده و چاپ فاکتور رسمی سفارش خریدار",
};

/**
 * Format currency with Persian digits.
 */
function formatToman(amount: number): string {
  return `${toPersianNum(amount.toLocaleString("fa-IR"))} تومان`;
}

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

/**
 * Official Buyer Order Invoice Page (Print-ready, compliant with Iranian invoicing standards).
 */
export default async function OrderInvoicePage({ params }: PageProps) {
  const { orderId } = await params;
  const decodedOrderId = decodeURIComponent(orderId);

  // Look up order by ID or order number, or fallback to first sample order if not found
  const order: OrderRecord | undefined =
    findOrderByIdOrNumber(decodedOrderId) || SAMPLE_ORDERS[0];

  if (!order) {
    notFound();
  }

  // Calculate totals
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountTotal = order.discountAmount ?? 0;
  const shippingFee = order.shippingFee ?? 0;
  const finalTotal = order.totalPrice;

  return (
    <div className="min-h-screen bg-muted/30 py-6 px-3 sm:px-6 print:bg-white print:p-0 print:m-0">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Navigation & Action Bar (Hidden when printing) */}
        <header
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs print:hidden"
          role="banner"
        >
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              aria-label="بازگشت به حساب کاربری"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
            >
              <ArrowRight className="size-4" aria-hidden="true" />
              <span>بازگشت به پروفایل</span>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-primary" aria-hidden="true" />
              <h1 className="text-sm sm:text-base font-bold text-foreground">
                فاکتور رسمی سفارش {order.orderNumber}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PrintInvoiceButton />
          </div>
        </header>

        {/* Official Invoice Sheet */}
        <article
          id="official-invoice"
          className="rounded-2xl border border-border bg-white p-6 sm:p-10 text-neutral-900 shadow-sm print:border-none print:shadow-none print:p-0 print:rounded-none"
          role="region"
          aria-label="سند صورتحساب رسمی سفارش"
        >
          {/* Top Header */}
          <div className="border-b-2 border-neutral-900 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                  فروشگاه سرو
                </p>
                <p className="text-xs text-neutral-600">
                  شرکت توسعه تجارت الکترونیک سرو پایدار (سهامی خاص)
                </p>
                <h2 className="text-sm sm:text-base font-bold text-neutral-800 pt-2">
                  صورتحساب رسمی فروش کالا و خدمات
                </h2>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 sm:min-w-[240px] space-y-1.5 text-xs text-neutral-700">
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-500">شماره سفارش:</span>
                  <span className="font-mono font-bold text-neutral-900">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-500">تاریخ صدور:</span>
                  <span className="font-medium text-neutral-900">
                    {order.createdAt}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-neutral-200">
                  <span className="font-medium text-neutral-500">وضعیت پرداخت:</span>
                  <Badge
                    variant="outline"
                    className="border-emerald-600 text-emerald-800 bg-emerald-50 text-[11px] font-semibold"
                  >
                    <CheckCircle2 className="size-3 ml-1" aria-hidden="true" />
                    پرداخت شده
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Parties Info: Seller and Buyer */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
            {/* Seller Details */}
            <section
              className="rounded-xl border border-neutral-200 p-4 space-y-2 bg-neutral-50/50"
              aria-label="مشخصات فروشنده"
            >
              <h3 className="font-bold text-neutral-900 border-b border-neutral-200 pb-1.5 text-sm">
                مشخصات فروشنده
              </h3>
              <div className="grid grid-cols-2 gap-y-1.5 text-neutral-700">
                <div>
                  <span className="text-neutral-500">فروشنده: </span>
                  <span className="font-semibold">فروشگاه آنلاین سرو</span>
                </div>
                <div>
                  <span className="text-neutral-500">شناسه ملی: </span>
                  <span className="font-mono">۱۰۱۰۳۹۴۸۵۷۱</span>
                </div>
                <div>
                  <span className="text-neutral-500">شماره اقتصادی: </span>
                  <span className="font-mono">۴۱۱۴۹۳۸۲۷۱</span>
                </div>
                <div>
                  <span className="text-neutral-500">تلفن پشتیبانی: </span>
                  <span className="font-mono">۰۲۱۹۱۰۰۱۲۳۴</span>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500">نشانی: </span>
                  <span>تهران، خیابان ولیعصر، بالاتر از پارک ساعی، برج سرو</span>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500">کد پستی: </span>
                  <span className="font-mono">۱۹۳۹۵۱۴۸۲۱</span>
                </div>
              </div>
            </section>

            {/* Buyer Details */}
            <section
              className="rounded-xl border border-neutral-200 p-4 space-y-2 bg-neutral-50/50"
              aria-label="مشخصات خریدار"
            >
              <h3 className="font-bold text-neutral-900 border-b border-neutral-200 pb-1.5 text-sm">
                مشخصات خریدار
              </h3>
              <div className="grid grid-cols-2 gap-y-1.5 text-neutral-700">
                <div>
                  <span className="text-neutral-500">نام تحویل‌گیرنده: </span>
                  <span className="font-semibold">
                    {order.customerName || "سارا احمدی"}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">شماره تماس: </span>
                  <span className="font-mono">
                    {order.customerPhone || "۰۹۱۲۳۴۵۶۷۸۹"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500">کد پستی: </span>
                  <span className="font-mono">
                    {order.customerPostalCode || "۱۹۳۹۵۴۳۲۱۱"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500">نشانی تحویل: </span>
                  <span>
                    {order.customerAddress ||
                      "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه ساعی یکم، پلاک ۱۲، طبقه ۳، واحد ۶"}
                  </span>
                </div>
                {order.trackingCode && (
                  <div className="col-span-2">
                    <span className="text-neutral-500">کد رهگیری مرسوله: </span>
                    <span className="font-mono font-medium">{order.trackingCode}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Items Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-right text-xs">
              <thead>
                <tr className="border-y-2 border-neutral-900 bg-neutral-100 font-bold text-neutral-900">
                  <th className="py-2.5 px-3 w-10 text-center">ردیف</th>
                  <th className="py-2.5 px-3">شرح کالا یا خدمات</th>
                  <th className="py-2.5 px-3 w-16 text-center">تعداد</th>
                  <th className="py-2.5 px-3 w-28 text-left">مبلغ واحد</th>
                  <th className="py-2.5 px-3 w-24 text-left">تخفیف</th>
                  <th className="py-2.5 px-3 w-32 text-left">مبلغ کل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items.map((item, index) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <tr key={item.id} className="text-neutral-800">
                      <td className="py-3 px-3 text-center font-mono">
                        {toPersianNum(index + 1)}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold">{item.title}</p>
                        {item.variantTitle && (
                          <p className="text-[11px] text-neutral-500">
                            {item.variantTitle}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold">
                        {toPersianNum(item.quantity)}
                      </td>
                      <td className="py-3 px-3 text-left font-mono">
                        {toPersianNum(item.price.toLocaleString("fa-IR"))}
                      </td>
                      <td className="py-3 px-3 text-left font-mono text-neutral-500">
                        {toPersianNum(0)}
                      </td>
                      <td className="py-3 px-3 text-left font-mono font-bold">
                        {toPersianNum(lineTotal.toLocaleString("fa-IR"))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="mt-6 border-t-2 border-neutral-900 pt-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              {/* Payment notes & terms */}
              <div className="space-y-2 text-xs text-neutral-600 sm:max-w-md">
                <p className="font-bold text-neutral-800">توضیحات و شرایط فروش:</p>
                <p className="text-[11px] leading-relaxed">
                  این سند صورتحساب رسمی فروش کالا از طریق درگاه پرداخت الکترونیک معتبر صادر شده
                  است. کلیه محصولات شامل ضمانت اصالت فیزیکی و مهلت تست ۷ روزه طبق قوانین تجارت
                  الکترونیک می‌باشند.
                </p>
              </div>

              {/* Totals Box */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs sm:w-80 space-y-2">
                <div className="flex justify-between text-neutral-700">
                  <span>جمع کل کالاها:</span>
                  <span className="font-mono">{formatToman(subtotal)}</span>
                </div>

                {discountTotal > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>تخفیف کل:</span>
                    <span className="font-mono font-medium">
                      - {formatToman(discountTotal)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-700">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? "رایگان" : formatToman(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-700">
                  <span>مالیات بر ارزش افزوده (۰٪):</span>
                  <span className="font-mono">{toPersianNum(0)} تومان</span>
                </div>

                <div className="flex justify-between items-center border-t-2 border-neutral-900 pt-2 text-sm font-bold text-neutral-900">
                  <span>مبلغ کل پرداختی:</span>
                  <span className="font-mono text-base font-black text-primary">
                    {formatToman(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Stamps */}
          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-neutral-200 pt-8 text-center text-xs text-neutral-600">
            <div className="space-y-8">
              <p className="font-bold text-neutral-800">مهر و امضای فروشنده</p>
              <div className="mx-auto flex h-16 w-36 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-[11px] text-neutral-400">
                محل مهر رسمی شرکت
              </div>
            </div>
            <div className="space-y-8">
              <p className="font-bold text-neutral-800">امضای خریدار / تحویل‌گیرنده</p>
              <div className="mx-auto flex h-16 w-36 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-[11px] text-neutral-400">
                امضاء و اثر انگشت
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

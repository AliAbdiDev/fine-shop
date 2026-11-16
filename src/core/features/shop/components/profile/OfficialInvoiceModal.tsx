"use client";

import { useId } from "react";

import { CheckCircle2, Download, FileText, X } from "lucide-react";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { toPersianNum } from "@/core/utils/helpers";

import type { OrderRecord } from "./orders-data";

interface OfficialInvoiceModalProps {
  order: OrderRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Format currency with Persian digits and Toman symbol.
 */
function formatToman(value: number): string {
  return `${toPersianNum(value.toLocaleString("fa-IR"))} تومان`;
}

/**
 * Download/Print ONLY the invoice element as PDF using an isolated iframe.
 */
function handleDownloadPdf(elementId: string, orderNumber: string) {
  const invoiceElement = document.getElementById(elementId);
  if (!invoiceElement || typeof window === "undefined") return;

  const printIframe = document.createElement("iframe");
  printIframe.style.position = "fixed";
  printIframe.style.right = "0";
  printIframe.style.bottom = "0";
  printIframe.style.width = "0";
  printIframe.style.height = "0";
  printIframe.style.border = "0";
  printIframe.style.zIndex = "-9999";
  document.body.appendChild(printIframe);

  const doc = printIframe.contentWindow?.document;
  if (!doc) return;

  // Extract all existing CSS styles to ensure accurate styling in print output
  const styles = Array.from(
    document.querySelectorAll("style, link[rel='stylesheet']")
  )
    .map((el) => el.outerHTML)
    .join("\n");

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
      <head>
        <meta charset="utf-8" />
        <title>فاکتور رسمی سفارش ${orderNumber}</title>
        ${styles}
        <style>
          @page { size: A4; margin: 12mm; }
          * { box-sizing: border-box; }
          body {
            background-color: #ffffff !important;
            color: #111827 !important;
            font-family: inherit;
            margin: 0 !important;
            padding: 12px !important;
            direction: rtl;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
        </style>
      </head>
      <body>
        <div id="print-root">
          ${invoiceElement.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    printIframe.contentWindow?.focus();
    printIframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(printIframe)) {
        document.body.removeChild(printIframe);
      }
    }, 1500);
  }, 400);
}

/**
 * Official Invoice Modal displaying full invoice specifications and PDF export.
 */
export function OfficialInvoiceModal({
  order,
  open,
  onOpenChange,
}: OfficialInvoiceModalProps) {
  const contentId = useId();

  if (!order) return null;

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountTotal = order.discountAmount ?? 0;
  const shippingFee = order.shippingFee ?? 0;
  const finalTotal = order.totalPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl"
        showCloseButton={false}
      >
        {/* Modal Header & Download Action */}
        <DialogHeader className="border-b pb-4 flex flex-row items-center justify-between gap-3 text-right">
          <div>
            <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <FileText className="size-5 text-primary" aria-hidden="true" />
              <span>فاکتور رسمی سفارش {order.orderNumber}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              صورتحساب معتبر خرید برای ارائه به مراجع مالی یا نگهداری در سوابق
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => handleDownloadPdf(contentId, order.orderNumber)}
              className="gap-1.5 text-xs min-h-[36px]"
              aria-label="دانلود نسخه PDF فاکتور رسمی"
            >
              <Download className="size-4" aria-hidden="true" />
              <span>دانلود فاکتور (PDF)</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              className="rounded-full cursor-pointer"
              aria-label="بستن پنجره فاکتور"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Official Invoice Sheet */}
        <div
          id={contentId}
          className="bg-white text-neutral-900 rounded-xl p-4 sm:p-8 border border-neutral-200 mt-4 text-xs space-y-6"
        >
          {/* Header Bar */}
          <div className="border-b-2 border-neutral-900 pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  فروشگاه سرو
                </p>
                <p className="text-xs text-neutral-600">
                  شرکت توسعه تجارت الکترونیک سرو پایدار (سهامی خاص)
                </p>
                <h3 className="text-sm sm:text-base font-bold text-neutral-800 pt-1">
                  صورتحساب رسمی فروش کالا و خدمات
                </h3>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 sm:min-w-[230px] space-y-1.5 text-neutral-700">
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
                    className="border-emerald-600 text-emerald-800 bg-emerald-50 text-[11px] font-semibold gap-1"
                  >
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                    پرداخت شده
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Seller and Buyer Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Seller */}
            <div className="rounded-xl border border-neutral-200 p-3.5 space-y-2 bg-neutral-50/50">
              <h4 className="font-bold text-neutral-900 border-b border-neutral-200 pb-1.5 text-xs sm:text-sm">
                مشخصات فروشنده
              </h4>
              <div className="grid grid-cols-2 gap-y-1.5 text-neutral-700 text-[11px] sm:text-xs">
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
            </div>

            {/* Buyer */}
            <div className="rounded-xl border border-neutral-200 p-3.5 space-y-2 bg-neutral-50/50">
              <h4 className="font-bold text-neutral-900 border-b border-neutral-200 pb-1.5 text-xs sm:text-sm">
                مشخصات خریدار
              </h4>
              <div className="grid grid-cols-2 gap-y-1.5 text-neutral-700 text-[11px] sm:text-xs">
                <div>
                  <span className="text-neutral-500">تحویل‌گیرنده: </span>
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
                    <span className="text-neutral-500">کد رهگیری: </span>
                    <span className="font-mono font-medium">{order.trackingCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right text-xs">
              <thead>
                <tr className="border-y-2 border-neutral-900 bg-neutral-100 font-bold text-neutral-900">
                  <th className="py-2.5 px-3 w-10 text-center">ردیف</th>
                  <th className="py-2.5 px-3">شرح کالا یا خدمات</th>
                  <th className="py-2.5 px-3 w-14 text-center">تعداد</th>
                  <th className="py-2.5 px-3 w-28 text-left">مبلغ واحد</th>
                  <th className="py-2.5 px-3 w-20 text-left">تخفیف</th>
                  <th className="py-2.5 px-3 w-32 text-left">مبلغ کل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items.map((item, index) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <tr key={item.id} className="text-neutral-800">
                      <td className="py-2.5 px-3 text-center font-mono">
                        {toPersianNum(index + 1)}
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-semibold">{item.title}</p>
                        {item.variantTitle && (
                          <p className="text-[11px] text-neutral-500">
                            {item.variantTitle}
                          </p>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold">
                        {toPersianNum(item.quantity)}
                      </td>
                      <td className="py-2.5 px-3 text-left font-mono">
                        {toPersianNum(item.price.toLocaleString("fa-IR"))}
                      </td>
                      <td className="py-2.5 px-3 text-left font-mono text-neutral-500">
                        {toPersianNum(0)}
                      </td>
                      <td className="py-2.5 px-3 text-left font-mono font-bold">
                        {toPersianNum(lineTotal.toLocaleString("fa-IR"))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="border-t-2 border-neutral-900 pt-4 flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-1.5 text-neutral-600 sm:max-w-md text-[11px]">
              <p className="font-bold text-neutral-800 text-xs">توضیحات و شرایط فروش:</p>
              <p className="leading-relaxed">
                این فاکتور رسمی به صورت الکترونیکی صادر شده و طبق مقررات قانون تجارت
                الکترونیک دارای ارزش قانونی است.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-700">
                <span>جمع کل اقلام:</span>
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

              <div className="flex justify-between items-center border-t-2 border-neutral-900 pt-2 text-xs sm:text-sm font-bold text-neutral-900">
                <span>مبلغ کل پرداختی:</span>
                <span className="font-mono text-sm sm:text-base font-black text-primary">
                  {formatToman(finalTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-600">
            <div className="space-y-6">
              <p className="font-bold text-neutral-800">مهر و امضای فروشنده</p>
              <div className="mx-auto flex h-14 w-32 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-[10px] text-neutral-400">
                محل مهر رسمی شرکت
              </div>
            </div>
            <div className="space-y-6">
              <p className="font-bold text-neutral-800">امضای خریدار / تحویل‌گیرنده</p>
              <div className="mx-auto flex h-14 w-32 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-[10px] text-neutral-400">
                امضاء و اثر انگشت
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

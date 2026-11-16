"use client";

import { useMemo, useState } from "react";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Hash,
  Package,
  Receipt,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";

import { notify } from "@/core/components/custom/notify";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { cn, toPersianNum } from "@/core/utils/helpers";

import { OfficialInvoiceModal } from "./OfficialInvoiceModal";
import {
  type OrderDeliveryStatus,
  type OrderItem,
  type OrderPaymentStatus,
  type OrderRecord,
  SAMPLE_ORDERS,
} from "./orders-data";

export type { OrderDeliveryStatus, OrderItem, OrderPaymentStatus, OrderRecord };

type FilterTab = "all" | "processing" | "delivered" | "cancelled";

/**
 * Format currency numbers with Persian digits and separator.
 */
function formatToman(value: number): string {
  return `${toPersianNum(value.toLocaleString("fa-IR"))} تومان`;
}

/**
 * Badge representation for order delivery status.
 */
function DeliveryStatusBadge({ status }: { status: OrderDeliveryStatus }) {
  switch (status) {
    case "delivered":
      return (
        <Badge
          variant="secondary"
          className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400 gap-1 font-normal text-xs"
        >
          <CheckCircle2 className="size-3" aria-hidden="true" />
          <span>تحویل شده</span>
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="secondary"
          className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400 gap-1 font-normal text-xs"
        >
          <Clock className="size-3" aria-hidden="true" />
          <span>در حال پردازش</span>
        </Badge>
      );
    case "pending_payment":
      return (
        <Badge
          variant="secondary"
          className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400 gap-1 font-normal text-xs"
        >
          <AlertCircle className="size-3" aria-hidden="true" />
          <span>در انتظار پرداخت</span>
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="secondary"
          className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 gap-1 font-normal text-xs"
        >
          <XCircle className="size-3" aria-hidden="true" />
          <span>لغو شده</span>
        </Badge>
      );
  }
}

/**
 * Badge representation for order payment status.
 */
function PaymentStatusBadge({ status }: { status: OrderPaymentStatus }) {
  switch (status) {
    case "paid":
      return (
        <Badge
          variant="outline"
          className="border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400 gap-1 text-[11px]"
        >
          <span>پرداخت موفق</span>
        </Badge>
      );
    case "unpaid":
      return (
        <Badge
          variant="outline"
          className="border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400 gap-1 text-[11px]"
        >
          <span>پرداخت نشده</span>
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="outline"
          className="border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-400 gap-1 text-[11px]"
        >
          <span>پرداخت ناموفق</span>
        </Badge>
      );
    case "refunded":
      return (
        <Badge
          variant="outline"
          className="border-stone-200 text-stone-700 dark:border-stone-700 dark:text-stone-300 gap-1 text-[11px]"
        >
          <RotateCcw className="size-2.5" aria-hidden="true" />
          <span>مسترد شده</span>
        </Badge>
      );
  }
}

/**
 * Single Order Card displaying historical order details and item breakdown.
 */
function OrderCardItem({
  order,
  onViewInvoice,
}: {
  order: OrderRecord;
  onViewInvoice: (order: OrderRecord) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItemsCount = useMemo(
    () => order.items.reduce((acc, curr) => acc + curr.quantity, 0),
    [order.items]
  );

  const handleCopyTrackingCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    notify.success("کد رهگیری پستی کپی شد");
  };

  return (
    <Card className="border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Order Header */}
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-sm font-semibold">
              <Hash className="text-muted-foreground size-4" aria-hidden="true" />
              <span>{order.orderNumber}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3.5" aria-hidden="true" />
              <span>ثبت شده در: {order.createdAt}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DeliveryStatusBadge status={order.deliveryStatus} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {/* Shipping method & tracking info */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Truck className="size-3.5 text-primary" aria-hidden="true" />
            <span>نحوه ارسال: {order.shippingMethod}</span>
          </div>

          {order.trackingCode && (
            <div className="flex items-center gap-1.5">
              <span>کد پیگیری:</span>
              <code className="bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-[11px]">
                {order.trackingCode}
              </code>
              <button
                type="button"
                onClick={() => handleCopyTrackingCode(order.trackingCode)}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                aria-label="کپی کد رهگیری پستی"
              >
                <Copy className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Order Content */}
      <CardContent className="pt-4">
        {/* Items summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">
              اقلام سفارش ({toPersianNum(totalItemsCount)} کالا):
            </span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 gap-1 text-xs cursor-pointer"
              aria-expanded={isExpanded}
            >
              <span>{isExpanded ? "بستن جزئیات اقلام" : "مشاهده اقلام کالا"}</span>
              {isExpanded ? (
                <ChevronUp className="size-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="size-3.5" aria-hidden="true" />
              )}
            </Button>
          </div>

          {/* Item Thumbnails Preview */}
          <div className="flex flex-wrap gap-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-xs ring-1 ring-black/5 dark:ring-white/10",
                  item.thumbnailGradient
                )}
                title={item.title}
              >
                <Package className="size-5 text-white/80" aria-hidden="true" />
                {item.quantity > 1 && (
                  <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-bold">
                    {toPersianNum(item.quantity)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Expanded Item Details List */}
          {isExpanded && (
            <div className="bg-muted/30 mt-3 space-y-2.5 rounded-xl p-3 text-xs">
              {order.items.map((item, idx) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-foreground font-medium">{item.title}</p>
                      {item.variantTitle && (
                        <p className="text-muted-foreground text-[11px]">
                          {item.variantTitle}
                        </p>
                      )}
                    </div>
                    <div className="text-left font-mono whitespace-nowrap">
                      <span>{toPersianNum(item.quantity)} × </span>
                      <span>{formatToman(item.price)}</span>
                    </div>
                  </div>
                  {idx < order.items.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Order Footer with Total and Invoice Action */}
      <CardFooter className="border-t bg-muted/10 flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-muted-foreground text-xs">مبلغ کل سفارش:</span>
          <span className="text-foreground text-sm sm:text-base font-bold">
            {formatToman(order.totalPrice)}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* View Official Invoice in Modal */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onViewInvoice(order)}
            className="w-full sm:w-auto min-h-[38px] gap-1.5 cursor-pointer"
            aria-label={`مشاهده فاکتور رسمی سفارش ${order.orderNumber}`}
          >
            <Receipt className="size-3.5" aria-hidden="true" />
            <span>مشاهده فاکتور</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

/**
 * ProfileOrdersTab Component:
 * Dedicated solely to displaying historical customer orders and invoice access.
 */
export function ProfileOrdersTab() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] =
    useState<OrderRecord | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const handleOpenInvoiceModal = (order: OrderRecord) => {
    setSelectedInvoiceOrder(order);
    setIsInvoiceModalOpen(true);
  };

  // Filter orders based on status
  const filteredOrders = useMemo(() => {
    return SAMPLE_ORDERS.filter((order) => {
      if (filter === "processing") return order.deliveryStatus === "processing";
      if (filter === "delivered") return order.deliveryStatus === "delivered";
      if (filter === "cancelled") return order.deliveryStatus === "cancelled";
      return true;
    });
  }, [filter]);

  const counts = useMemo(
    () => ({
      all: SAMPLE_ORDERS.length,
      processing: SAMPLE_ORDERS.filter((o) => o.deliveryStatus === "processing")
        .length,
      delivered: SAMPLE_ORDERS.filter((o) => o.deliveryStatus === "delivered")
        .length,
      cancelled: SAMPLE_ORDERS.filter((o) => o.deliveryStatus === "cancelled")
        .length,
    }),
    []
  );

  return (
    <div
      className="space-y-6"
      role="region"
      aria-labelledby="profile-orders-heading"
    >
      {/* Header and description */}
      <div className="border-border bg-card rounded-2xl border p-4 sm:p-6 shadow-sm">
        <h2
          id="profile-orders-heading"
          className="text-foreground text-lg sm:text-xl font-bold"
        >
          سوابق و گزارش سفارش‌ها
        </h2>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
          مشاهده، پیگیری و دریافت فاکتور رسمی کلیه سفارش‌های ثبت شده در حساب شما
        </p>

        {/* Filter Badges */}
        <div
          className="mt-5 flex flex-wrap gap-2 border-t pt-4"
          role="tablist"
          aria-label="فیلتر وضعیت سفارش‌ها"
        >
          <Button
            type="button"
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-xl text-xs min-h-[36px]"
          >
            <span>همه</span>
            <span className="opacity-70">({toPersianNum(counts.all)})</span>
          </Button>

          <Button
            type="button"
            variant={filter === "processing" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("processing")}
            className="rounded-xl text-xs min-h-[36px]"
          >
            <span>در حال پردازش</span>
            <span className="opacity-70">({toPersianNum(counts.processing)})</span>
          </Button>

          <Button
            type="button"
            variant={filter === "delivered" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("delivered")}
            className="rounded-xl text-xs min-h-[36px]"
          >
            <span>تحویل شده</span>
            <span className="opacity-70">({toPersianNum(counts.delivered)})</span>
          </Button>

          <Button
            type="button"
            variant={filter === "cancelled" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("cancelled")}
            className="rounded-xl text-xs min-h-[36px]"
          >
            <span>لغو شده</span>
            <span className="opacity-70">({toPersianNum(counts.cancelled)})</span>
          </Button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="border-border bg-card py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <div
              className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-2xl"
              aria-hidden="true"
            >
              <Package className="size-7" />
            </div>
            <p className="text-foreground text-sm font-medium">
              هیچ سفارشی در این وضعیت یافت نشد
            </p>
            <p className="text-muted-foreground text-xs max-w-sm">
              سفارش‌های جدید شما پس از تکمیل مراحل خرید در این بخش ثبت خواهند شد.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCardItem
              key={order.id}
              order={order}
              onViewInvoice={handleOpenInvoiceModal}
            />
          ))}
        </div>
      )}

      {/* Official Invoice Modal */}
      <OfficialInvoiceModal
        order={selectedInvoiceOrder}
        open={isInvoiceModalOpen}
        onOpenChange={setIsInvoiceModalOpen}
      />
    </div>
  );
}

export default ProfileOrdersTab;

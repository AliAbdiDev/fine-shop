export type OrderDeliveryStatus =
  | "delivered"
  | "processing"
  | "pending_payment"
  | "cancelled";

export type OrderPaymentStatus = "paid" | "unpaid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  title: string;
  variantTitle?: string;
  quantity: number;
  price: number;
  thumbnailGradient: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  deliveryDate?: string;
  deliveryStatus: OrderDeliveryStatus;
  paymentStatus: OrderPaymentStatus;
  shippingMethod: string;
  trackingCode?: string;
  totalPrice: number;
  discountAmount?: number;
  shippingFee: number;
  items: OrderItem[];
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerPostalCode?: string;
}

export const SAMPLE_ORDERS: OrderRecord[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-94821",
    createdAt: "۱۴۰۳/۰۸/۲۴",
    deliveryDate: "۱۴۰۳/۰۸/۲۷",
    deliveryStatus: "processing",
    paymentStatus: "paid",
    shippingMethod: "ارسال سریع FineShop (پست پیشتاز)",
    trackingCode: "۲۸۴۹۱۰۹۳۸۱۷۲۰۰۴۹",
    totalPrice: 18450000,
    shippingFee: 0,
    customerName: "سارا احمدی",
    customerPhone: "۰۹۱۲۳۴۵۶۷۸۹",
    customerAddress: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه ساعی یکم، پلاک ۱۲، طبقه ۳، واحد ۶",
    customerPostalCode: "۱۹۳۹۵۴۳۲۱۱",
    items: [
      {
        id: "item-101",
        title: "هدفون بی‌سیم سونی مدل WH-1000XM5",
        variantTitle: "رنگ مشکی مات | گارانتی ۱۸ ماهه",
        quantity: 1,
        price: 16800000,
        thumbnailGradient: "from-zinc-800 to-zinc-950",
      },
      {
        id: "item-102",
        title: "پایه نگهدارنده آلومینیومی هدفون",
        variantTitle: "نقره‌ای",
        quantity: 1,
        price: 1650000,
        thumbnailGradient: "from-slate-700 to-slate-900",
      },
    ],
  },
  {
    id: "ord-2",
    orderNumber: "ORD-89104",
    createdAt: "۱۴۰۳/۰۸/۱۸",
    deliveryDate: "۱۴۰۳/۰۸/۲۱",
    deliveryStatus: "delivered",
    paymentStatus: "paid",
    shippingMethod: "تحویل اکسپرس درون‌شهری",
    trackingCode: "۱۰۹۴۸۲۳۷۵۶۱۲۹۸۳۴",
    totalPrice: 42300000,
    discountAmount: 1200000,
    shippingFee: 0,
    customerName: "سارا احمدی",
    customerPhone: "۰۹۱۲۳۴۵۶۷۸۹",
    customerAddress: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه ساعی یکم، پلاک ۱۲، طبقه ۳، واحد ۶",
    customerPostalCode: "۱۹۳۹۵۴۳۲۱۱",
    items: [
      {
        id: "item-201",
        title: "ساعت هوشمند اپل مدل Series 9 Aluminum 45mm",
        variantTitle: "استارلایت | بند اسپرت",
        quantity: 1,
        price: 39500000,
        thumbnailGradient: "from-amber-600 to-amber-900",
      },
      {
        id: "item-202",
        title: "کاور محافظ سیلیکونی اپل واچ",
        variantTitle: "شفاف ضد ضربه",
        quantity: 2,
        price: 1400000,
        thumbnailGradient: "from-blue-600 to-blue-900",
      },
    ],
  },
  {
    id: "ord-3",
    orderNumber: "ORD-83490",
    createdAt: "۱۴۰۳/۰۸/۱۰",
    deliveryStatus: "pending_payment",
    paymentStatus: "unpaid",
    shippingMethod: "تیپاکس (پس‌کرایه)",
    totalPrice: 8750000,
    shippingFee: 65000,
    customerName: "سارا احمدی",
    customerPhone: "۰۹۱۲۳۴۵۶۷۸۹",
    customerAddress: "تهران، میدان انقلاب، خیابان کارگر شمالی، خیابان فرصت شیرازی، ساختمان پیام، پلاک ۵، طبقه ۴",
    customerPostalCode: "۱۴۱۷۶۱۴۴۱۱",
    items: [
      {
        id: "item-301",
        title: "کیبورد مکانیکال گیمینگ ردراگون مدل K552",
        variantTitle: "سوییچ آبی | نورپردازی RGB",
        quantity: 1,
        price: 3850000,
        thumbnailGradient: "from-red-600 to-zinc-900",
      },
      {
        id: "item-302",
        title: "ماوس بی‌سیم لاجیتک مدل MX Master 3S",
        variantTitle: "خاکستری تیره",
        quantity: 1,
        price: 4900000,
        thumbnailGradient: "from-emerald-700 to-zinc-900",
      },
    ],
  },
  {
    id: "ord-4",
    orderNumber: "ORD-76120",
    createdAt: "۱۴۰۳/۰۷/۲۹",
    deliveryStatus: "cancelled",
    paymentStatus: "refunded",
    shippingMethod: "پست پیشتاز",
    totalPrice: 2950000,
    shippingFee: 49000,
    customerName: "سارا احمدی",
    customerPhone: "۰۹۱۲۳۴۵۶۷۸۹",
    customerAddress: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه ساعی یکم، پلاک ۱۲، طبقه ۳، واحد ۶",
    customerPostalCode: "۱۹۳۹۵۴۳۲۱۱",
    items: [
      {
        id: "item-401",
        title: "کوله پشتی لپ‌تاپ ضدآب ویوو مدل Alpha",
        variantTitle: "مناسب برای لپ‌تاپ ۱۵.۶ اینچ | طوسی",
        quantity: 1,
        price: 2950000,
        thumbnailGradient: "from-stone-700 to-stone-900",
      },
    ],
  },
];

/**
 * Helper to retrieve an order by its unique ID or order number.
 */
export function findOrderByIdOrNumber(idOrNumber: string): OrderRecord | undefined {
  return SAMPLE_ORDERS.find(
    (order) => order.id === idOrNumber || order.orderNumber === idOrNumber
  );
}

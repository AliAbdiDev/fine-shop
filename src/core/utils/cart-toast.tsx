import Link from "next/link";

import { toast } from "sonner";

import { ROUTES } from "@/core/constants/misc";

export function showAddToCartToast() {
  toast.success("محصول به سبد خرید شما اضافه شد", {
    description: (
      <Link
        href={ROUTES.CART as any}
        className="text-primary underline hover:opacity-80"
      >
        برای رفتن به سبد خرید روی این متن کلیک کنید
      </Link>
    ),
  });
}

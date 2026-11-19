"use client";

import { Plus } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { useCart } from "@/core/states/cart";
import { type Product } from "@/core/types/entities.types";
import { showAddToCartToast } from "@/core/utils/cart-toast";
import { isFile } from "@/core/utils/helpers";

interface AddToCartButtonProps {
  disabled?: boolean;
  product?: Product;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showToast?: boolean;
}

export function AddToCartButton({
  disabled,
  product,
  onClick,
  showToast = true,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (onClick) {
      onClick(e);
      if (showToast) {
        showAddToCartToast();
      }
      return;
    }

    if (product && product.id != null) {
      const firstImage = product.images?.[0];
      const imageUrl =
        firstImage && !isFile(firstImage) ? firstImage.url : undefined;

      addItem({
        id: String(product.id),
        productId: Number(product.id),
        name: product.name,
        image: imageUrl,
        basePrice: product.basePrice,
        discountedPrice: product.discountedPrice,
        quantity: 1,
      });

      if (showToast) {
        showAddToCartToast();
      }
    }
  };

  return (
    <Button
      size="icon"
      className="h-8 w-8 shrink-0 rounded-md"
      aria-label="افزودن به سبد خرید"
      disabled={disabled}
      onClick={handleClick}
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}

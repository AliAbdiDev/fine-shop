"use client";

import { Plus } from "lucide-react";

import { Button } from "@/core/components/ui/button";

interface AddToCartButtonProps {
  disabled?: boolean;
}

export function AddToCartButton({ disabled }: AddToCartButtonProps) {
  return (
    <Button
      size="icon"
      className="h-8 w-8 shrink-0 rounded-md"
      aria-label="افزودن به سبد خرید"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}

"use client";

import { Printer } from "lucide-react";

import { Button } from "@/core/components/ui/button";

/**
 * Print Invoice Button triggering native browser print dialog.
 */
export function PrintInvoiceButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Button
      type="button"
      onClick={handlePrint}
      variant="default"
      size="sm"
      className="gap-1.5 min-h-[36px]"
      aria-label="چاپ یا دریافت نسخه PDF فاکتور رسمی"
    >
      <Printer className="size-4" aria-hidden="true" />
      <span>چاپ فاکتور</span>
    </Button>
  );
}

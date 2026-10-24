// core/components/ui/server-action-submit-button.tsx
"use client";

import type { ComponentProps } from "react";

import { useFormStatus } from "react-dom";

import { Button } from "@/core/components/ui/button";

type Props = Omit<ComponentProps<typeof Button>, "type" | "disabled"> & {
  loadingText?: string;
  loading?: boolean;
};

export function PendingSubmitButton({
  children,
  loadingText = "در حال ارسال...",
  loading,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || loading} {...props}>
      {pending || loading ? loadingText : children}
    </Button>
  );
}

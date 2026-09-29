"use client";

import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/core/components/ui/alert-dialog";

const DEFAULT_CONFIRM_TEXT = "تایید";
const DEFAULT_CANCEL_TEXT = "انصراف";

type AlertModalProps = {
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  media?: React.ReactNode;
  children?: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmVariant?: React.ComponentProps<typeof AlertDialogAction>["variant"];
  cancelVariant?: React.ComponentProps<typeof AlertDialogCancel>["variant"];
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
  size?: "default" | "sm";
  showCancel?: boolean;
  confirmDisabled?: boolean;
  className?: string;
};

export const AlertModal = ({
  trigger,
  title,
  description,
  media,
  children,
  confirmText = DEFAULT_CONFIRM_TEXT,
  cancelText = DEFAULT_CANCEL_TEXT,
  confirmVariant = "default",
  cancelVariant = "outline",
  onConfirm,
  onCancel,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  loading = false,
  size = "default",
  showCancel = true,
  confirmDisabled = false,
  className,
}: AlertModalProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const confirmedRef = React.useRef(false);

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    controlledOnOpenChange?.(next);

    if (!next && !confirmedRef.current) onCancel?.();
    if (!next) {
      confirmedRef.current = false;
    }
  };

  const handleConfirm = async () => {
    confirmedRef.current = true;

    if (onConfirm) {
      try {
        setIsPending(true);
        await onConfirm();
      } catch {
        setIsPending(false);
        confirmedRef.current = false;
        return;
      }
      setIsPending(false);
    }

    setOpen(false);
  };

  const isBusy = loading || isPending;

  const resolvedConfirmText = confirmText ?? DEFAULT_CONFIRM_TEXT;
  const resolvedCancelText = cancelText ?? DEFAULT_CANCEL_TEXT;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <AlertDialogTrigger
          nativeButton
          render={(props) => (
            <button
              type="button"
              {...props}
              className="size-full cursor-pointer text-start outline-none"
            >
              {trigger}
            </button>
          )}
        />
      )}

      <AlertDialogContent size={size} className={className}>
        {(title || description || media) && (
          <AlertDialogHeader>
            {media && <AlertDialogMedia>{media}</AlertDialogMedia>}
            {title && (
              <AlertDialogTitle className="border-border w-full border-b pb-2">
                {title}
              </AlertDialogTitle>
            )}
            {description && (
              <AlertDialogDescription className="pt-2">
                {description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
        )}

        {children && <div className="text-sm">{children}</div>}

        <AlertDialogFooter>
          {showCancel && (
            <AlertDialogCancel variant={cancelVariant} disabled={isBusy}>
              {resolvedCancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            variant={confirmVariant}
            onClick={(e) => {
              e.preventDefault();
              void handleConfirm();
            }}
            disabled={isBusy || confirmDisabled}
          >
            {isBusy ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {resolvedConfirmText}
              </span>
            ) : (
              resolvedConfirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

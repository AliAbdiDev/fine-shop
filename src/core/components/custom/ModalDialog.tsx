"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";

type ModalDialogProps = {
  trigger?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showClose?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
};

const sizeClasses: Record<NonNullable<ModalDialogProps["size"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-3xl",
};

export const ModalDialog = ({
  trigger,
  title,
  description,
  children,
  footer,
  size = "lg",
  showClose = true,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onClose,
}: ModalDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled =
    controlledOpen !== undefined && controlledOnOpenChange !== undefined;

  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
  };

  const previousOpenRef = React.useRef(open);

  React.useEffect(() => {
    const previousOpen = previousOpenRef.current;

    if (previousOpen === true && open === false) {
      onClose?.();
    }

    previousOpenRef.current = open;
  }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger as React.ReactElement} />}

      <DialogContent showCloseButton={showClose} className={sizeClasses[size]}>
        {(title || description) && (
          <DialogHeader className="border-border border-b pb-4">
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription className="pt-0.5">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="py-2">{children}</div>

        {footer && (
          <DialogFooter className="border-border border-t pt-4">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/core/utils/helpers";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-transparent dark:hover:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-3 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
        xs: "h-7 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        lg: "h-11 gap-1.5 px-4 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/* ─────────────────────────────────────────────
   Loading types
   ───────────────────────────────────────────── */

type LoadingType = "spinner" | "skeleton";

interface ButtonProps
  extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  /** Show loading state. Automatically disables the button. */
  loading?: boolean;
  /**
   * Loading indicator style.
   * - `"spinner"` (default) — replaces children with a spinner (+ optional text).
   * - `"skeleton"` — ignores `children` and renders a fixed placeholder
   *   sized to match the given `size`. The button never reflects the real
   *   content while loading.
   */
  loadingType?: LoadingType;
  /**
   * Text shown next to the spinner while loading.
   * If omitted, the original `children` stay visible.
   * Ignored in `"skeleton"` mode.
   */
  loadingText?: string;
}

/* ─────────────────────────────────────────────
   Skeleton placeholder
   ───────────────────────────────────────────── */

const SKELETON_WIDTH: Record<string, string> = {
  xs: "w-8", // 32px
  sm: "w-12", // 48px
  default: "w-16", // 64px
  lg: "w-20", // 80px
};

function SkeletonContent({ size }: { size?: string | null }) {
  /* Icon-only buttons → a round dot matching the icon footprint */
  if (size?.startsWith("icon")) {
    return (
      <span
        aria-hidden
        className="block size-4 animate-pulse rounded-full bg-current/30"
      />
    );
  }

  /* Text buttons → a bar. `block` forces the height to apply even if the
     button's flex context is ever broken. Widths are tuned for short
     Persian labels. */
  return (
    <span
      aria-hidden
      className={cn(
        "block h-5 w-16 animate-pulse rounded-full bg-current/30",
        SKELETON_WIDTH[size ?? "default"] ?? SKELETON_WIDTH.default,
      )}
    />
  );
}

/* ─────────────────────────────────────────────
   Button
   ───────────────────────────────────────────── */

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  loadingType = "spinner",
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isIconOnly = Boolean(size?.startsWith("icon"));
  const showSkeleton = loading && loadingType === "skeleton";
  const showSpinner = loading && loadingType === "spinner";

  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading ? loadingType : undefined}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {showSkeleton ? (
        <SkeletonContent size={size} />
      ) : showSpinner ? (
        isIconOnly ? (
          <Loader2 className="animate-spin" aria-hidden />
        ) : (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            <span>{loadingText ?? children}</span>
          </>
        )
      ) : (
        children
      )}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
export type { ButtonProps, LoadingType };

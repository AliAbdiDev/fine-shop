import Image from "next/image";

import { cva, type VariantProps } from "class-variance-authority";

import { BRAND_NAME } from "@/core/constants/misc";
import { cn } from "@/core/utils/helpers";

export const logoSizeMap = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
  xl: "h-16",
} as const;

export type LogoSize = keyof typeof logoSizeMap;

const logoVariants = cva("inline-flex shrink-0 items-center", {
  variants: {
    size: {
      sm: logoSizeMap.sm,
      md: logoSizeMap.md,
      lg: logoSizeMap.lg,
      xl: logoSizeMap.xl,
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      full: "rounded-full",
    },
  },
  defaultVariants: { size: "md", rounded: "none" },
});

const types = {
  logo: "/images/logo.png",
  logoType: "/images/logo-type.png",
};
export interface LogoProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof logoVariants> {
  alt?: string;
  priority?: boolean;
  quality?: number;
  type?: keyof typeof types;
}

export function Logo({
  alt = BRAND_NAME || "لوگو",
  size = "md",
  rounded,
  priority,
  className,
  quality = 75,
  type = "logo",
  ...props
}: LogoProps) {
  return (
    <span
      className={cn(
        logoVariants({ size, rounded }),
        "w-auto overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <Image
        src={types[type]}
        alt={alt}
        width={300}
        height={100}
        priority={priority}
        quality={quality}
        draggable={false}
        className="h-full w-fit object-cover object-center"
      />
    </span>
  );
}

export { logoVariants };
